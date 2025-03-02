import { DollarSign } from 'lucide-react'
function BusinessDetails({
  businessDetails,
  currentFunding,
  progressPercentage,
  setShowInvestModal,
  setShowCrowdfundModal,
  error,
  cibilScore,
  fundingGoalReached, // Add this prop
}) {
  return (
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
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            CIBIL Score: <span className="font-medium">{cibilScore !== null ? cibilScore : 'Calculating...'}</span> / 900
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${cibilScore >= 750 ? 'bg-green-500' : cibilScore >= 700 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${(cibilScore / 900) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => setShowInvestModal(true)}
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              fundingGoalReached ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={fundingGoalReached}
          >
            <DollarSign className="w-4 h-4" />
            <span>Invest Now</span>
          </button>
          <button
            onClick={() => setShowCrowdfundModal(true)}
            className={`bg-green-600 text-white px-4 py-2 rounded-lg transition-colors ${
              fundingGoalReached ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
            disabled={fundingGoalReached}
          >
            Crowdfund
          </button>
        </div>
      </div>
      {error && <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg">{error}</div>}
    </div>
  );
}

export default BusinessDetails;