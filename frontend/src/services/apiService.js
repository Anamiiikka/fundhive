// frontend/src/services/apiService.js
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProjects(userId, getAccessTokenSilently) {
  const token = await getAccessTokenSilently();
  const response = await fetch(`${API_URL}/projects`, {
    headers: {
      'X-User-ID': userId,
      Authorization: `Bearer ${token}`, // Added for consistency with authentication
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  const projects = await response.json();
  const posts = projects.map((project) => ({
    id: project._id,
    username: project.userId?.username || 'Unknown User',
    userAvatar: project.userId?.avatarUrl || 'https://via.placeholder.com/64',
    content: {
      type: project.mediaUrl?.includes('.mp4') ? 'video' : 'image',
      url: project.mediaUrl || 'https://via.placeholder.com/400',
    },
    description: project.description,
    businessDetails: {
      title: project.title,
      fundingGoal: project.fundingGoal,
      equityOffered: project.equityOffered,
      userId: project.userId?.auth0Id || project.userId, // Project creator's ID
    },
    category: project.category,
    currentFunding: project.currentFunding || 0,
    likes: project.likes || [],
    comments: project.comments || [],
    startDate: project.startDate,
    duration: project.duration,
    escrowTransactions: project.escrowTransactions || [], // Add escrow transactions
  }));

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

  return { posts, trending };
}

export async function fetchProjectById(postId, userId, getAccessTokenSilently) {
  const token = await getAccessTokenSilently();
  const response = await fetch(`${API_URL}/projects/${postId}`, {
    headers: {
      'X-User-ID': userId,
      Authorization: `Bearer ${token}`, // Ensure authentication
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch project');
  }

  const project = await response.json();
  return {
    id: project._id,
    username: project.userId?.username || 'Unknown User',
    userAvatar: project.userId?.avatarUrl || 'https://via.placeholder.com/64',
    content: {
      type: project.mediaUrl?.includes('.mp4') ? 'video' : 'image',
      url: project.mediaUrl || 'https://via.placeholder.com/400',
    },
    description: project.description,
    businessDetails: {
      title: project.title,
      fundingGoal: project.fundingGoal,
      equityOffered: project.equityOffered,
      userId: project.userId?.auth0Id || project.userId,
    },
    category: project.category,
    currentFunding: project.currentFunding || 0,
    likes: project.likes || [],
    comments: project.comments || [],
    startDate: project.startDate,
    duration: project.duration,
    escrowTransactions: project.escrowTransactions || [],
  };
}

export async function likePost(postId, userId) {
  const response = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'X-User-ID': userId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) throw new Error('Failed to like post');
  return await response.json();
}

export async function commentPost(postId, userId, content) {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'X-User-ID': userId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, content }),
  });

  if (!response.ok) throw new Error('Failed to add comment');
  return await response.json();
}

export async function investPost(postId, userId, amount) {
  const response = await fetch(`${API_URL}/posts/${postId}/invest`, {
    method: 'POST',
    headers: {
      'X-User-ID': userId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, amount }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to invest');
  }
  return await response.json(); // Returns { message, project, transactionId }
}

export async function crowdfundPost(postId, userId, amount) {
  const response = await fetch(`${API_URL}/posts/${postId}/crowdfund`, {
    method: 'POST',
    headers: {
      'X-User-ID': userId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, amount }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to crowdfund');
  }
  return await response.json(); // Returns { message, project, transactionId }
}

export async function deleteProject(postId, userId) {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'X-User-ID': userId,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete project');
  }

  return await response.json();
}