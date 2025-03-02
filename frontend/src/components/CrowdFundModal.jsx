import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

function CrowdfundModal({
  showCrowdfundModal,
  setShowCrowdfundModal,
  businessDetails,
  rewards,
  selectedReward,
  setSelectedReward,
  crowdfundAmount,
  setCrowdfundAmount,
  handleCrowdfund,
}) {
  const [transactionId, setTransactionId] = useState(null); // State for blockchain transaction ID
  const [error, setError] = useState(null); // State for error handling

  if (!showCrowdfundModal) return null;

  // Define updated rewards
  const updatedRewards = [
    { amount: 20, title: 'Early Supporter', description: 'Get exclusive updates and behind-the-scenes content' },
    { amount: 50, title: 'Premium Backer', description: 'Early access to the product + exclusive updates' },
    { amount: 100, title: 'VIP Supporter', description: 'All previous rewards + personalized thank you note' },
  ];

  const handleCrowdfundSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(crowdfundAmount);
    if (amount < 10) {
      setError('Crowdfunding amount must be at least $10');
      return;
    }

    if (!businessDetails.id) {
      setError('Project ID is missing');
      console.error('businessDetails.id is undefined:', businessDetails);
      return;
    }

    try {
      const response = await handleCrowdfund(businessDetails.id, amount);
      if (response.error) {
        setError(response.error);
      } else {
        setTransactionId(response.transactionId);
        setError(null);
        // Optionally keep form values until modal closes, but resetting can be done on close
      }
    } catch (err) {
      console.error('Error processing crowdfunding:', err);
      setError(err.message || 'Crowdfunding failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Support {businessDetails.title}</h3>
          <button onClick={() => setShowCrowdfundModal(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {transactionId ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">Crowdfunding successful! Funds are held in escrow.</p>
            <p className="text-sm text-gray-600">
              Blockchain Transaction ID: <span className="font-mono">{transactionId}</span>
            </p>
            <button
              onClick={() => {
                setShowCrowdfundModal(false);
                setTransactionId(null);
                setCrowdfundAmount('');
                setSelectedReward(null);
                setError(null);
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">Select a Reward</h4>
              <div className="space-y-3">
                {updatedRewards.map((reward) => (
                  <button
                    key={reward.amount}
                    onClick={() => {
                      setSelectedReward(reward);
                      setCrowdfundAmount(reward.amount.toString());
                    }}
                    className={cn(
                      'w-full p-4 rounded-lg border-2 text-left transition-all',
                      selectedReward && selectedReward.amount === reward.amount
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
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
            <form onSubmit={handleCrowdfundSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Contribution Amount (USD)
                </label>
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
              {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">{error}</div>}
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Contribution
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default CrowdfundModal;