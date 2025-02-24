export async function fetchProjects(userId, getAccessTokenSilently) {
  const token = await getAccessTokenSilently();
  const response = await fetch('http://localhost:5000/api/projects', {
    headers: {
      'X-User-ID': userId,
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

export async function likePost(postId, userId) {
  const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
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
  const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
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
  const response = await fetch(`http://localhost:5000/api/posts/${postId}/invest`, {
    method: 'POST',
    headers: {
      'X-User-ID': userId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, amount }),
  });

  if (!response.ok) throw new Error('Failed to invest');
  return await response.json();
}

export async function crowdfundPost(postId, userId, amount) {
  const response = await fetch(`http://localhost:5000/api/posts/${postId}/crowdfund`, {
    method: 'POST',
    headers: {
      'X-User-ID': userId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, amount }),
  });

  if (!response.ok) throw new Error('Failed to crowdfund');
  return await response.json();
}