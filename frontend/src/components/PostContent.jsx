import React from 'react';

function PostContent({ content }) {
  return (
    <div className="relative">
      {content.type === 'image' ? (
        <img src={content.url} alt="Post content" className="w-full h-[400px] object-cover" />
      ) : (
        <video src={content.url} controls className="w-full h-[400px] object-cover" />
      )}
    </div>
  );
}

export default PostContent;