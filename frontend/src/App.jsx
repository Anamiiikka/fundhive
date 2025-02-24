import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Post } from './components/Post';
import { CreateProject } from './components/CreateProject';
import { UserProfile } from './components/UserProfile';
import { Notifications } from './components/Notifications';
import { Rocket, Search, TrendingUp, Briefcase, Code, Leaf, Cpu, Palette, Bell, UserCircle, Plus } from 'lucide-react';

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

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
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    setLoadingPosts(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'X-User-ID': user.sub,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
  
      const projects = await response.json();
      console.log('Projects from backend:', projects); // Debug: Check response
  
      const fetchedPosts = projects.map((project) => ({
        id: project._id,
        username: project.userId?.username || 'Unknown User',
        userAvatar: project.userId?.avatarUrl || 'https://via.placeholder.com/64', // Use avatarUrl from backend
        content: {
          type: project.mediaUrl?.includes('.mp4') ? 'video' : 'image',
          url: project.mediaUrl ? `http://localhost:5000${project.mediaUrl}` : 'https://via.placeholder.com/400',
        },
        description: project.description,
        businessDetails: {
          title: project.title,
          fundingGoal: project.fundingGoal,
          equityOffered: project.equityOffered,
        },
        category: project.category,
        currentFunding: project.currentFunding || 0,
        likes: project.likes || [],
        comments: project.comments || [],
        startDate: project.startDate,
        duration: project.duration,
      }));
      setPosts(fetchedPosts);
  
      const trending = projects
        .map((project) => ({
          id: project._id,
          title: project.title,
          fundingPercentage: Math.min((project.currentFunding / project.fundingGoal) * 100, 100),
          hoursLeft: Math.max(
            0,
            Math.floor((new Date(project.startDate).getTime() + project.duration * 24 * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60))
          ),
        }))
        .sort((a, b) => b.fundingPercentage - a.fundingPercentage)
        .slice(0, 3);
      setTrendingProjects(trending);
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

      const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'X-User-ID': user.sub,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.sub }),
      });

      if (!response.ok) throw new Error('Failed to like post');
      const updatedProject = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? { ...p, likes: updatedProject.project.likes } : p))
      );
    } catch (err) {
      console.error('Error liking post:', err);
      setError(err.message);
      fetchProjects();
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

      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'X-User-ID': user.sub,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.sub, content: `${user.name}: ${commentText}` }),
      });

      if (!response.ok) throw new Error('Failed to add comment');
      const updatedProject = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? { ...p, comments: updatedProject.project.comments } : p))
      );
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.message);
      fetchProjects();
    }
  };

  const handleInvest = async (postId, amount) => {
    try {
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, currentFunding: p.currentFunding + amount } : p
        )
      );
      updateTrendingProjectsOptimistically(postId, amount);

      const response = await fetch(`http://localhost:5000/api/posts/${postId}/invest`, {
        method: 'POST',
        headers: {
          'X-User-ID': user.sub,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.sub, amount }),
      });

      if (!response.ok) throw new Error('Failed to invest');
      const updatedProject = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, currentFunding: updatedProject.project.currentFunding } : p
        )
      );
      updateTrendingProjects(updatedProject.project);
    } catch (err) {
      console.error('Error investing:', err);
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? { ...p, currentFunding: p.currentFunding - amount } : p))
      );
      updateTrendingProjectsOptimistically(postId, -amount);
      throw err;
    }
  };

  const handleCrowdfund = async (postId, amount) => {
    try {
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, currentFunding: p.currentFunding + amount } : p
        )
      );
      updateTrendingProjectsOptimistically(postId, amount);

      const response = await fetch(`http://localhost:5000/api/posts/${postId}/crowdfund`, {
        method: 'POST',
        headers: {
          'X-User-ID': user.sub,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.sub, amount }),
      });

      if (!response.ok) throw new Error('Failed to crowdfund');
      const updatedProject = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, currentFunding: updatedProject.project.currentFunding } : p
        )
      );
      updateTrendingProjects(updatedProject.project);
    } catch (err) {
      console.error('Error crowdfunding:', err);
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? { ...p, currentFunding: p.currentFunding - amount } : p))
      );
      updateTrendingProjectsOptimistically(postId, -amount);
      throw err;
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
                Math.floor((new Date(updatedProject.startDate).getTime() + updatedProject.duration * 24 * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60))
              ),
            }
          : project
      )
    );
  };

  const handleProjectCreated = () => {
    setShowCreateProject(false);
    fetchProjects();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const categories = [
    { id: 'tech', name: 'Technology', icon: <Cpu className="w-5 h-5" /> },
    { id: 'business', name: 'Business', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'software', name: 'Software', icon: <Code className="w-5 h-5" /> },
    { id: 'sustainability', name: 'Green Tech', icon: <Leaf className="w-5 h-5" /> },
    { id: 'creative', name: 'Creative', icon: <Palette className="w-5 h-5" /> },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      post.businessDetails.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Rocket className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">FundHive</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateProject(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Plus className="w-5 h-5" />
                <span>Create Project</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-600 hover:text-gray-900 relative"
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <Notifications
                    notifications={notifications}
                    onClose={() => setShowNotifications(false)}
                    onMarkAsRead={(id) => {
                      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
                    }}
                  />
                )}
              </div>
              <button onClick={() => setShowProfile(!showProfile)} className="text-gray-600 hover:text-gray-900">
                <UserCircle className="w-6 h-6" />
              </button>
            </nav>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="bg-white shadow-sm mt-4">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === category.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {/* Trending Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Trending Projects</h2>
          </div>
          {loadingPosts ? (
            <div>Loading trending projects...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingProjects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">{project.title}</h3>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.fundingPercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{project.fundingPercentage.toFixed(1)}% funded</span>
                      <span>{project.hoursLeft}h left</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Posts */}
        <div className="space-y-8">
          {loadingPosts ? (
            <div>Loading posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div>No projects found.</div>
          ) : (
            filteredPosts.map((post) => (
              <Post
                key={post.id}
                {...post}
                userSub={user.sub}
                onLike={() => handleLike(post.id)}
                onComment={(commentText) => handleComment(post.id, commentText)}
                onInvest={handleInvest}
                onCrowdfund={handleCrowdfund}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
      {showCreateProject && <CreateProject onClose={handleProjectCreated} />}
    </div>
  );
}

export default App;