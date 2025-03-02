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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(comment);
      setComment('');
    }
  };

  const handleInvest = async () => { // Remove 'e' parameter since it's called directly
    const amount = parseFloat(investmentAmount);
    if (amount >= 10) {
      setError(null);
      try {
        const response = await onInvest(id, amount); // Call onInvest directly with id and amount
        setShowInvestModal(false);
        setInvestmentAmount('');
        return response; // Return response for InvestModal
      } catch (err) {
        setError(err.message || 'Investment failed');
        throw err;
      }
    } else {
      setError('Investment amount must be at least $10');
    }
  };

  const handleCrowdfund = async () => { // Remove 'e' parameter
    const amount = parseFloat(crowdfundAmount);
    if (amount >= 10) {
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
    } else {
      setError('Crowdfunding amount must be at least $10');
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
    businessDetails: { ...businessDetails, id },
  };
}