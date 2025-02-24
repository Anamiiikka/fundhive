import React from 'react';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostActions from './PostActions';
import PostDescription from './PostDescription';
import BusinessDetails from './BusinessDetails';
import CommentsSection from './CommentsSection';
import InvestModal from './InvestModal';
import CrowdfundModal from './CrowdfundModal';
import ShareModal from './ShareModal';
import { usePost } from '../hooks/usePost';

function Post({
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
  const {
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
  } = usePost({
    id,
    likes,
    comments,
    onLike,
    onComment,
    currentFunding,
    businessDetails,
    onInvest,
    onCrowdfund,
    userSub,
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-2xl mx-auto my-8">
      <PostHeader username={username} userAvatar={userAvatar} />
      <PostContent content={content} />
      <div className="p-4">
        <PostActions
          likes={likes}
          comments={comments}
          onLike={onLike}
          setShowComments={setShowComments}
          showComments={showComments}
          setShowShareModal={setShowShareModal}
          userSub={userSub}
        />
        <PostDescription description={description} />
        <BusinessDetails
          businessDetails={businessDetails}
          currentFunding={currentFunding}
          progressPercentage={progressPercentage}
          setShowInvestModal={setShowInvestModal}
          setShowCrowdfundModal={setShowCrowdfundModal}
          error={error}
        />
        <CommentsSection
          showComments={showComments}
          comments={comments}
          comment={comment}
          setComment={setComment}
          handleCommentSubmit={handleCommentSubmit}
        />
      </div>
      <InvestModal
        showInvestModal={showInvestModal}
        setShowInvestModal={setShowInvestModal}
        businessDetails={businessDetails}
        investmentAmount={investmentAmount}
        setInvestmentAmount={setInvestmentAmount}
        handleInvest={handleInvest}
      />
      <CrowdfundModal
        showCrowdfundModal={showCrowdfundModal}
        setShowCrowdfundModal={setShowCrowdfundModal}
        businessDetails={businessDetails}
        rewards={rewards}
        selectedReward={selectedReward}
        setSelectedReward={setSelectedReward}
        crowdfundAmount={crowdfundAmount}
        setCrowdfundAmount={setCrowdfundAmount}
        handleCrowdfund={handleCrowdfund}
      />
      <ShareModal showShareModal={showShareModal} setShowShareModal={setShowShareModal} handleShare={handleShare} />
    </div>
  );
}

export default Post;