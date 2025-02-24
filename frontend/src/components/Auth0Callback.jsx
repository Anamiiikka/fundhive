import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export function Auth0Callback() {
  const { handleRedirectCallback, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        await handleRedirectCallback(); // This processes the Auth0 redirect
        navigate('/'); // Redirect to home after successful login
      } catch (err) {
        console.error('Error handling callback:', err);
        navigate('/login'); // Redirect to login on error
      }
    };

    handleAuth();
  }, [handleRedirectCallback, navigate]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div>Loading...</div>;
}