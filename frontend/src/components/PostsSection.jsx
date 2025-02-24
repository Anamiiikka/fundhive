import React from 'react';
import Post from './Post'; // Changed to default import

function PostsSection({ posts, loadingPosts, userSub, onLike, onComment, onInvest, onCrowdfund }) {
  return (
    <div className="space-y-8">
      {loadingPosts ? (
        <div>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div>No projects found.</div>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            {...post}
            userSub={userSub}
            onLike={() => onLike(post.id)}
            onComment={(commentText) => onComment(post.id, commentText)}
            onInvest={onInvest}
            onCrowdfund={onCrowdfund}
          />
        ))
      )}
    </div>
  );
}

export default PostsSection;