import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, DollarSign, X, Award, Link, Twitter, Facebook, Linkedin } from 'lucide-react';
import { cn } from '../lib/utils';

export function Post({
  id,
  username,
  userAvatar,
  content,
  description,
  businessDetails,
  likes,
  comments,
  onLike,
  onComment,
  currentFunding,
  userSub,
  onInvest,
  onCrowdfund,
}) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showCrowdfundModal, setShowCrowdfundModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [crowdfundAmount, setCrowdfundAmount] = useState('');
  const [selectedReward, setSelectedReward] = useState(null);
  const [error, setError] = useState(null); // Added for error display

  const rewards = [
    { amount: 50, title: 'Early Supporter', description: 'Get exclusive updates and behind-the-scenes content' },
    { amount: 200, title: 'Premium Backer', description: 'Early access to the product + exclusive updates' },
    { amount: 500, title: 'VIP Supporter', description: 'All previous rewards + personalized thank you video' },
  ];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(comment);
      setComment('');
    }
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    const amount = parseFloat(investmentAmount);
    if (amount > 0) {
      setError(null); // Clear previous errors
      try {
        await onInvest(id, amount); // Optimistic update handled in App.jsx
        setShowInvestModal(false);
        setInvestmentAmount('');
      } catch (err) {
        setError(err.message); // Display error in UI
      }
    }
  };

  const handleCrowdfund = async (e) => {
    e.preventDefault();
    const amount = parseFloat(crowdfundAmount);
    if (amount > 0) {
      setError(null); // Clear previous errors
      try {
        await onCrowdfund(id, amount); // Optimistic update handled in App.jsx
        setShowCrowdfundModal(false);
        setCrowdfundAmount('');
      } catch (err) {
        setError(err.message); // Display error in UI
      }
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${businessDetails.title} on FundHive!`;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`);
        break;
      default:
        break;
    }
    setShowShareModal(false);
  };

  const progressPercentage = Math.min((currentFunding / businessDetails.fundingGoal) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-2xl mx-auto my-8">
      {/* Header */}
      <div className="p-4 flex items-center space-x-3">
        <img src={userAvatar} alt={username} className="w-10 h-10 rounded-full object-cover" />
        <span className="font-semibold">{username}</span>
      </div>

      {/* Content */}
      <div className="relative">
        {content.type === 'image' ? (
          <img src={content.url} alt="Post content" className="w-full h-[400px] object-cover" />
        ) : (
          <video src={content.url} controls className="w-full h-[400px] object-cover" />
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
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

        {/* Description */}
        <p className="mt-4 text-gray-800">{description}</p>

        {/* Business Details */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg">{businessDetails.title}</h3>
          <div className="mt-2 space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Raised: ${currentFunding.toLocaleString()}</span>
                <span>Goal: ${businessDetails.fundingGoal.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{progressPercentage.toFixed(1)}% of goal reached</p>
            </div>
            <p className="text-sm text-gray-600">Equity Offered: {businessDetails.equityOffered}%</p>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowInvestModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
              >
                <DollarSign className="w-4 h-4" />
                <span>Invest Now</span>
              </button>
              <button
                onClick={() => setShowCrowdfundModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Crowdfund
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg">{error}</div>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
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
        )}

        {/* Invest Modal */}
        {showInvestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Invest in {businessDetails.title}</h3>
                <button onClick={() => setShowInvestModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleInvest}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="1000"
                      step="100"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      className="pl-8 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Minimum $1,000"
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Estimated equity: {investmentAmount ? ((parseFloat(investmentAmount) / businessDetails.fundingGoal) * businessDetails.equityOffered).toFixed(2) : '0'}%
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Investment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Crowdfund Modal */}
        {showCrowdfundModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Support {businessDetails.title}</h3>
                <button onClick={() => setShowCrowdfundModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3">Select a Reward</h4>
                <div className="space-y-3">
                  {rewards.map((reward) => (
                    <button
                      key={reward.amount}
                      onClick={() => {
                        setSelectedReward(reward);
                        setCrowdfundAmount(reward.amount.toString());
                      }}
                      className={cn(
                        'w-full p-4 rounded-lg border-2 text-left transition-all',
                        selectedReward && selectedReward.amount === reward.amount ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{reward.title}</span>
                        <span className="text-blue-600">${reward.amount}</span>
                      </div>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleCrowdfund}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Contribution Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="10"
                      step="10"
                      value={crowdfundAmount}
                      onChange={(e) => {
                        setCrowdfundAmount(e.target.value);
                        setSelectedReward(null);
                      }}
                      className="pl-8 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Minimum $10"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm Contribution
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
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
        )}
      </div>
    </div>
  );
}