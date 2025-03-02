// frontend/src/components/PostPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Post from './Post';
import { fetchProjectById } from '../services/apiService'; // Updated import

function PostPage() {
  const { id } = useParams();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const loadPost = async () => {
        try {
          const fetchedPost = await fetchProjectById(id, user.sub, getAccessTokenSilently);
          setPost(fetchedPost);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      loadPost();
    }
  }, [id, isAuthenticated, user, getAccessTokenSilently]);

  if (!isAuthenticated) return <div>Please log in to view this post.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found.</div>;

  const handleLike = () => {}; // Implement as needed
  const handleComment = () => {};
  const handleInvest = () => {};
  const handleCrowdfund = () => {};

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Post
        {...post}
        userSub={user.sub}
        onLike={handleLike}
        onComment={handleComment}
        onInvest={handleInvest}
        onCrowdfund={handleCrowdfund}
      />
    </div>
  );
}

export default PostPage;