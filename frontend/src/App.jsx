import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from './components/Header';
import Categories from './components/Categories';
import ErrorDisplay from './components/ErrorDisplay';
import MainContent from './components/MainContent';
import Modals from './components/Modals';
import { useAppState } from './hooks/useAppState';

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate(); // Hook for navigation
  const {
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
    trendingProjects,
    loadingPosts,
    error,
    filteredPosts,
    handleLike,
    handleComment,
    handleInvest,
    handleCrowdfund,
    handleProjectCreated,
  } = useAppState({ user, isAuthenticated, getAccessTokenSilently });

  // Redirect to /login if not authenticated and not loading
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Render the app only if authenticated
  return (
    <>
      {isAuthenticated && (
        <div className="min-h-screen bg-gray-100">
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            setShowProfile={setShowProfile}
            setShowCreateProject={setShowCreateProject}
            setNotifications={setNotifications}
          />
          <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          <ErrorDisplay error={error} />
          <MainContent
            trendingProjects={trendingProjects}
            loadingPosts={loadingPosts}
            posts={filteredPosts}
            userSub={user.sub}
            onLike={handleLike}
            onComment={handleComment}
            onInvest={handleInvest}
            onCrowdfund={handleCrowdfund}
          />
          <Modals
            showProfile={showProfile}
            setShowProfile={setShowProfile}
            showCreateProject={showCreateProject}
            onCloseCreateProject={handleProjectCreated}
          />
        </div>
      )}
    </>
  );
}

export default App;