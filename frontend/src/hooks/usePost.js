// frontend/src/hooks/usePost.js
import { useState } from 'react';

export function usePost({ id, likes, comments, onLike, onComment, currentFunding, businessDetails, onInvest, onCrowdfund, userSub }) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showCrowdfundModal, setShowCrowdfundModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [crowdfundAmount, setCrowdfundAmount] = useState('');
  const [selectedReward, setSelectedReward] = useState(null);
  const [error, setError] = useState(null);

  const rewards = [
    { amount: 20, title: 'Early Supporter', description: 'Get exclusive updates and behind-the-scenes content' },
    { amount: 50, title: 'Premium Backer', description: 'Early access to the product + exclusive updates' },
    { amount: 100, title: 'VIP Supporter', description: 'All previous rewards + personalized thank you note' },
  ];

  const fundingGoalReached = currentFunding >= businessDetails.fundingGoal;
  const progressPercentage = Math.min((currentFunding / businessDetails.fundingGoal) * 100, 100);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(comment);
      setComment('');
    }
  };

  const handleInvest = async () => {
    if (fundingGoalReached) {
      setError('Funding goal has been reached; no further investments are allowed.');
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (amount < 10) {
      setError('Investment amount must be at least $10');
      return;
    }

    // Check if this investment would exceed the funding goal
    const potentialFunding = currentFunding + amount;
    if (potentialFunding > businessDetails.fundingGoal) {
      setError(
        `Investment exceeds funding goal. Maximum allowed investment is $${(
          businessDetails.fundingGoal - currentFunding
        ).toFixed(2)}.`
      );
      return;
    }

    setError(null);
    try {
      const response = await onInvest(id, amount);
      setShowInvestModal(false);
      setInvestmentAmount('');
      return response;
    } catch (err) {
      setError(err.message || 'Investment failed');
      throw err;
    }
  };

  const handleCrowdfund = async () => {
    if (fundingGoalReached) {
      setError('Funding goal has been reached; no further crowdfunding is allowed.');
      return;
    }

    const amount = parseFloat(crowdfundAmount);
    if (amount < 10) {
      setError('Crowdfunding amount must be at least $10');
      return;
    }

    // Check if this contribution would exceed the funding goal
    const potentialFunding = currentFunding + amount;
    if (potentialFunding > businessDetails.fundingGoal) {
      setError(
        `Contribution exceeds funding goal. Maximum allowed contribution is $${(
          businessDetails.fundingGoal - currentFunding
        ).toFixed(2)}.`
      );
      return;
    }

    setError(null);
    try {
      const response = await onCrowdfund(id, amount);
      setShowCrowdfundModal(false);
      setCrowdfundAmount('');
      setSelectedReward(null);
      return response;
    } catch (err) {
      setError(err.message || 'Crowdfunding failed');
      throw err;
    }
  };

  const handleShare = (platform) => {
    // Use environment variable for base URL, fallback to current origin
    const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const postUrl = `${baseUrl}/posts/${id}`; // Construct post-specific URL
    const text = `Check out ${businessDetails.title} on FundHive!`;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(postUrl);
        alert('Post link copied to clipboard!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(text)}`,
          '_blank'
        );
        break;
      default:
        break;
    }
    setShowShareModal(false);
  };

  return {
    showComments,
    setShowComments,
    comment,
    setComment,
    showInvestModal,
    setShowInvestModal,
    showCrowdfundModal,
    setShowCrowdfundModal,
    showShareModal,
    setShowShareModal,
    investmentAmount,
    setInvestmentAmount,
    crowdfundAmount,
    setCrowdfundAmount,
    selectedReward,
    setSelectedReward,
    error,
    rewards,
    handleCommentSubmit,
    handleInvest,
    handleCrowdfund,
    handleShare,
    progressPercentage,
    fundingGoalReached, // Expose this to allow UI to disable buttons
    businessDetails: { ...businessDetails, id },
  };
}