// File: frontend/src/hooks/usePost.js
import { useState } from 'react';
import axios from 'axios';

export function usePost({ id, likes, comments, onLike, onComment, currentFunding, businessDetails, onInvest, onCrowdfund, userSub }) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showCrowdfundModal, setShowCrowdfundModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [crowdfundAmount, setCrowdfundAmount] = useState('');
  const [selectedReward, setSelectedReward] = useState(null);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const rewards = [
    { amount: 20, title: 'Early Supporter', description: 'Get exclusive updates and behind-the-scenes content' }, // Changed from 50
    { amount: 50, title: 'Premium Backer', description: 'Early access to the product + exclusive updates' },      // Changed from 200
    { amount: 100, title: 'VIP Supporter', description: 'All previous rewards + personalized thank you note' },  // Changed from 500
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
    if (amount >= 10) { // Updated minimum check to 10
      setError(null);
      try {
        await onInvest(id, amount);
        setShowInvestModal(false);
        setInvestmentAmount('');
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError('Investment amount must be at least $10');
    }
  };

  const handleCrowdfund = async (e) => {
    e.preventDefault();
    const amount = parseFloat(crowdfundAmount);
    if (amount >= 10) { // Minimum remains 10
      setError(null);
      try {
        await onCrowdfund(id, amount);
        setShowCrowdfundModal(false);
        setCrowdfundAmount('');
      } catch (err) {
        setError(err.message);
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
  };
}