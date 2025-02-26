import React, { useState, useEffect } from 'react';
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
import { Brain } from 'lucide-react';

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

  const [cibilScore] = useState(() => {
    const existingScore = localStorage.getItem(`cibilScore_${id}`);
    if (existingScore) {
      return parseInt(existingScore, 10);
    }
    const newScore = Math.floor(Math.random() * (800 - 650 + 1)) + 650;
    localStorage.setItem(`cibilScore_${id}`, newScore);
    return newScore;
  });

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const fetchAIAnalysis = async () => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    setShowAnalysis(true);

    try {
      const prompt = `
        Analyze the following business idea and provide a business analysis score (0-100) and a detailed pointwise report. Structure your response as follows:
        - Business Analysis Score: [score]/100
        - Analysis:
          - [Point 1]
          - [Point 2]
          - [Point 3]
          - [Add more points as needed]

        Business Idea Details:
        - Title: ${businessDetails.title}
        - Description: ${description}
        - Funding Goal: $${businessDetails.fundingGoal}
        - Equity Offered: ${businessDetails.equityOffered}%
        - Current Funding: $${currentFunding}
        - CIBIL Score: ${cibilScore}

        Consider market potential, financial viability, creditworthiness (based on CIBIL score), and funding progress when generating the score and report.
      `;

      const response = await fetch('http://localhost:5000/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      if (!response.ok) throw new Error('Failed to fetch AI analysis');

      const result = await response.json();
      // Clean up the report points by removing asterisks
      const cleanedReport = result.report.map(point => point.replace(/\*\*/g, '').trim());
      setAnalysisResult({ ...result, report: cleanedReport });
    } catch (err) {
      setAnalysisError(err.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

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
          cibilScore={cibilScore}
        />
        <CommentsSection
          showComments={showComments}
          comments={comments}
          comment={comment}
          setComment={setComment}
          handleCommentSubmit={handleCommentSubmit}
        />

        {/* AI Analysis Button */}
        <button
          onClick={fetchAIAnalysis}
          className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          disabled={analysisLoading}
        >
          <Brain className="w-5 h-5" />
          <span>{analysisLoading ? 'Analyzing...' : 'AI Analysis'}</span>
        </button>

        {/* AI Analysis Result */}
        {showAnalysis && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">AI Business Analysis</h3>
            {analysisLoading ? (
              <p className="text-gray-600">Loading analysis...</p>
            ) : analysisError ? (
              <div>
                <p className="text-red-600">Error: {analysisError}</p>
                {analysisError.includes('Rate limit exceeded') && (
                  <button
                    onClick={fetchAIAnalysis}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Try Again
                  </button>
                )}
              </div>
            ) : analysisResult ? (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Business Analysis Score: {analysisResult.score}/100
                </p>
                {analysisResult.score === 0 && (
                  <p className="text-sm text-yellow-600 mb-2">
                    Warning: Score is 0. The AI might need more data for an accurate analysis.
                  </p>
                )}
                <ul className="space-y-2 text-gray-700">
                  {analysisResult.report.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-600">No analysis available.</p>
            )}
          </div>
        )}
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