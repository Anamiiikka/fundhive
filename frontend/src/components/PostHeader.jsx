import React from 'react';

function PostHeader({ username, userAvatar }) {
  return (
    <div className="p-4 flex items-center space-x-3">
      <img src={userAvatar} alt={username} className="w-10 h-10 rounded-full object-cover" />
      <span className="font-semibold">{username}</span>
    </div>
  );
}

export default PostHeader;