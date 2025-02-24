import React from 'react';
import TrendingSection from './TrendingSection';
import PostsSection from './PostsSection';

function MainContent({ trendingProjects, loadingPosts, posts, userSub, onLike, onComment, onInvest, onCrowdfund }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <TrendingSection trendingProjects={trendingProjects} loadingPosts={loadingPosts} />
      <PostsSection
        posts={posts}
        loadingPosts={loadingPosts}
        userSub={userSub}
        onLike={onLike}
        onComment={onComment}
        onInvest={onInvest}
        onCrowdfund={onCrowdfund}
      />
    </div>
  );
}

export default MainContent;