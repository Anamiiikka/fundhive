import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoadingAndAuthCheck({ isLoading, isAuthenticated }) {
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return null;
}

export default LoadingAndAuthCheck;