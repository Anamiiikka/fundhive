import React from 'react';
import { X, Link, Twitter, Facebook, Linkedin } from 'lucide-react';

function ShareModal({ showShareModal, setShowShareModal, handleShare }) {
  if (!showShareModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Share this project</h3>
          <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleShare('copy')}
            className="flex items-center justify-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <Link className="w-5 h-5" />
            <span>Copy Link</span>
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center justify-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <Twitter className="w-5 h-5" />
            <span>Twitter</span>
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center justify-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <Facebook className="w-5 h-5" />
            <span>Facebook</span>
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="flex items-center justify-center space-x-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
            <span>LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;