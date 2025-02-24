import React from 'react';

function CommentsSection({ showComments, comments, comment, setComment, handleCommentSubmit }) {
  if (!showComments) return null;

  return (
    <div className="mt-4">
      <form onSubmit={handleCommentSubmit} className="flex space-x-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Post
        </button>
      </form>
      <div className="mt-4 space-y-2">
        {comments.map((c, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded-lg">
            <p className="text-sm">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentsSection;