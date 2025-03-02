import { useState, useEffect } from 'react';
import { fetchProjects, likePost, commentPost, investPost, crowdfundPost, deleteProject } from '../services/apiService';

export function useAppState({ user, isAuthenticated, getAccessTokenSilently }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'investment',
      message: 'New $5,000 investment in AI Workspace Pro!',
      timestamp: new Date(),
      read: false,
    },
    {
      id: '2',
      type: 'milestone',
      message: 'SolarTech Solutions reached 75% of funding goal!',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
  ]);
  const [posts, setPosts] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      handleFetchProjects();
    }
  }, [isAuthenticated]);

  const handleFetchProjects = async () => {
    setLoadingPosts(true);
    setError(null);
    try {
      const projects = await fetchProjects(user.sub, getAccessTokenSilently);
      setPosts(projects.posts);
      setTrendingProjects(projects.trending);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      const alreadyLiked = post.likes.includes(user.sub);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? { ...p, likes: alreadyLiked ? p.likes.filter((id) => id !== user.sub) : [...p.likes, user.sub] }
            : p
        )
      );
      const updatedProject = await likePost(postId, user.sub);
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? { ...p, likes: updatedProject.project.likes } : p))
      );
    } catch (err) {
      console.error('Error liking post:', err);
      setError(err.message);
      handleFetchProjects();
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? { ...p, comments: [...p.comments, { userId: user.sub, content: `${user.name}: ${commentText}` }] }
            : p
        )
      );
      const updatedProject = await commentPost(postId, user.sub, `${user.name}: ${commentText}`);
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? { ...p, comments: updatedProject.project.comments } : p))
      );
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.message);
      handleFetchProjects();
    }
  };

  const handleInvest = async (postId, amount) => {
    try {
      if (!posts || !Array.isArray(posts)) {
        throw new Error('Posts data is not available');
      }
  
      const post = posts.find((p) => p.id === postId);
      if (!post) {
        throw new Error('Post not found');
      }
  
      if (post.currentFunding >= post.businessDetails.fundingGoal) {
        throw new Error('Funding goal has been reached; no further investments are allowed.');
      }
  
      const potentialFunding = post.currentFunding + amount;
      if (potentialFunding > post.businessDetails.fundingGoal) {
        throw new Error(
          `Investment exceeds funding goal. Maximum allowed investment is $${(
            post.businessDetails.fundingGoal - post.currentFunding
          ).toFixed(2)}.`
        );
      }
  
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                currentFunding: p.currentFunding + amount,
                escrowTransactions: [
                  ...p.escrowTransactions,
                  { type: 'investment', userId: user.sub, amount, status: 'pending', transactionId: 'pending' },
                ],
              }
            : p
        )
      );
      updateTrendingProjectsOptimistically(postId, amount);
  
      const updatedProject = await investPost(postId, user.sub, amount);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                currentFunding: updatedProject.project.currentFunding,
                escrowTransactions: updatedProject.project.escrowTransactions,
              }
            : p
        )
      );
      updateTrendingProjects(updatedProject.project);
  
      if (updatedProject.project.currentFunding >= updatedProject.project.fundingGoal) {
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'milestone',
            message: `${updatedProject.project.title} reached its funding goal! Escrow funds released.`,
            timestamp: new Date(),
            read: false,
          },
        ]);
      }
  
      return updatedProject; // Success: { message, project, transactionId }
    } catch (err) {
      console.error('Error investing:', err);
      // Ensure rollback only if post exists
      const post = posts && posts.find((p) => p.id === postId);
      if (post) {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  currentFunding: p.currentFunding - amount,
                  escrowTransactions: p.escrowTransactions.filter((tx) => tx.transactionId !== 'pending'),
                }
              : p
          )
        );
        updateTrendingProjectsOptimistically(postId, -amount);
      }
      setError(err.message);
      return { error: err.message, transactionId: null }; // Always return an object
    }
  };

  const handleCrowdfund = async (postId, amount) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) throw new Error('Post not found');

      if (post.currentFunding >= post.businessDetails.fundingGoal) {
        throw new Error('Funding goal has been reached; no further crowdfunding is allowed.');
      }

      const potentialFunding = post.currentFunding + amount;
      if (potentialFunding > post.businessDetails.fundingGoal) {
        throw new Error(
          `Contribution exceeds funding goal. Maximum allowed contribution is $${(
            post.businessDetails.fundingGoal - post.currentFunding
          ).toFixed(2)}.`
        );
      }

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                currentFunding: p.currentFunding + amount,
                escrowTransactions: [
                  ...p.escrowTransactions,
                  { type: 'crowdfunding', userId: user.sub, amount, status: 'pending', transactionId: 'pending' },
                ],
              }
            : p
        )
      );
      updateTrendingProjectsOptimistically(postId, amount);

      const updatedProject = await crowdfundPost(postId, user.sub, amount);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                currentFunding: updatedProject.project.currentFunding,
                escrowTransactions: updatedProject.project.escrowTransactions,
              }
            : p
        )
      );
      updateTrendingProjects(updatedProject.project);

      if (updatedProject.project.currentFunding >= updatedProject.project.fundingGoal) {
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: 'milestone',
            message: `${updatedProject.project.title} reached its funding goal! Escrow funds released.`,
            timestamp: new Date(),
            read: false,
          },
        ]);
      }

      return updatedProject; // Success: { message, project, transactionId }
    } catch (err) {
      console.error('Error crowdfunding:', err);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                currentFunding: p.currentFunding - amount,
                escrowTransactions: p.escrowTransactions.filter((tx) => tx.transactionId !== 'pending'),
              }
            : p
        )
      );
      updateTrendingProjectsOptimistically(postId, -amount);
      setError(err.message);
      return { error: err.message, transactionId: null }; // Error response
    }
  };

  const handleDeleteProject = async (postId) => {
    try {
      await deleteProject(postId, user.sub);
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
      setTrendingProjects((prevTrending) => prevTrending.filter((p) => p.id !== postId));
      return true;
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.message);
      return false;
    }
  };

  const updateTrendingProjectsOptimistically = (postId, amountDelta) => {
    setTrendingProjects((prevTrending) =>
      prevTrending.map((project) => {
        if (project.id === postId) {
          const post = posts.find((p) => p.id === postId);
          const newFunding = post.currentFunding + amountDelta;
          return {
            ...project,
            fundingPercentage: Math.min((newFunding / post.businessDetails.fundingGoal) * 100, 100),
          };
        }
        return project;
      })
    );
  };

  const updateTrendingProjects = (updatedProject) => {
    setTrendingProjects((prevTrending) =>
      prevTrending.map((project) =>
        project.id === updatedProject._id
          ? {
              ...project,
              fundingPercentage: Math.min((updatedProject.currentFunding / updatedProject.fundingGoal) * 100, 100),
              hoursLeft: Math.max(
                0,
                Math.floor(
                  (new Date(updatedProject.startDate).getTime() +
                    updatedProject.duration * 24 * 60 * 60 * 1000 -
                    Date.now()) /
                    (1000 * 60 * 60)
                )
              ),
            }
          : project
      )
    );
  };

  const handleProjectCreated = () => {
    setShowCreateProject(false);
    handleFetchProjects();
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      post.businessDetails.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    showNotifications,
    setShowNotifications,
    showProfile,
    setShowProfile,
    showCreateProject,
    setShowCreateProject,
    notifications,
    setNotifications,
    posts,
    trendingProjects,
    loadingPosts,
    error,
    filteredPosts,
    handleLike,
    handleComment,
    handleInvest,
    handleCrowdfund,
    handleProjectCreated,
    handleDeleteProject,
  };
}