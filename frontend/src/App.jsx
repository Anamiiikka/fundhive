import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Header from './components/Header';
import Categories from './components/Categories';
import ErrorDisplay from './components/ErrorDisplay';
import MainContent from './components/MainContent';
import Modals from './components/Modals';
import LoadingAndAuthCheck from './components/LoadingAndAuthCheck';
import { useAppState } from './hooks/useAppState';

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
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

  return (
    <>
      <LoadingAndAuthCheck isLoading={isLoading} isAuthenticated={isAuthenticated} />
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