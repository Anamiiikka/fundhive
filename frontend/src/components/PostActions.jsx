import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';

function PostActions({ likes, comments, onLike, setShowComments, showComments, setShowShareModal, userSub }) {
  return (
    <div className="flex items-center space-x-4">
      <button onClick={onLike} className="flex items-center space-x-1">
        <Heart
          className={cn('w-6 h-6 transition-colors', likes.includes(userSub) ? 'fill-red-500 text-red-500' : 'text-gray-600')}
        />
        <span>{likes.length}</span>
      </button>
      <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1 text-gray-600">
        <MessageCircle className="w-6 h-6" />
        <span>{comments.length}</span>
      </button>
      <button onClick={() => setShowShareModal(true)} className="flex items-center space-x-1 text-gray-600">
        <Share2 className="w-6 h-6" />
      </button>
    </div>
  );
}

export default PostActions;