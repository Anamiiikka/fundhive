import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const API_URL = import.meta.env.VITE_API_URL;

function InvestModal({
  showInvestModal,
  setShowInvestModal,
  businessDetails,
  investmentAmount,
  setInvestmentAmount,
  handleInvest,
}) {
  const { user } = useAuth0();
  const [mode, setMode] = useState('direct');
  const [proposedAmount, setProposedAmount] = useState('');
  const [proposedEquity, setProposedEquity] = useState('');
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  if (!showInvestModal) return null;

  const handleDirectInvestment = async (e) => {
    e.preventDefault();
    const amount = parseFloat(investmentAmount);
    if (amount < 10) {
      setError('Investment amount must be at least $10');
      return;
    }

    if (!businessDetails.id) {
      setError('Project ID is missing');
      console.error('businessDetails.id is undefined:', businessDetails);
      return;
    }

    try {
      const response = await handleInvest(businessDetails.id, amount);
      // Safeguard against undefined response
      if (!response) {
        setError('Investment exceeds the goal');
      } else if (response.error) {
        setError(response.error);
      } else {
        setTransactionId(response.transactionId);
        setError(null);
      }
    } catch (err) {
      console.error('Error processing investment:', err);
      setError(err.message || 'Investment failed');
    }
  };

  const handleNegotiationSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(proposedAmount);
    const equity = parseFloat(proposedEquity);
    if (amount < 10 || equity <= 0 || equity > 100) {
      setError('Proposed amount must be at least $10 and equity between 0.1% and 100%');
      return;
    }

    if (!businessDetails.id) {
      setError('Project ID is missing');
      console.error('businessDetails.id is undefined:', businessDetails);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts/${businessDetails.id}/negotiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.sub,
        },
        body: JSON.stringify({
          investorId: user.sub,
          proposedAmount: amount,
          proposedEquity: equity,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Server error');
      }

      alert('Negotiation request sent successfully!');
      setShowInvestModal(false);
      setProposedAmount('');
      setProposedEquity('');
      setError(null);
    } catch (err) {
      console.error('Error sending negotiation:', err);
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Invest in {businessDetails.title}</h3>
          <button onClick={() => setShowInvestModal(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setMode('direct')}
            className={`flex-1 py-2 rounded-lg ${
              mode === 'direct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Direct Investment
          </button>
          <button
            onClick={() => setMode('negotiate')}
            className={`flex-1 py-2 rounded-lg ${
              mode === 'negotiate' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Negotiate
          </button>
        </div>

        {mode === 'direct' ? (
          transactionId ? (
            <div className="text-center">
              <p className="text-green-600 mb-4">Investment successful! Funds are held in escrow.</p>
              <p className="text-sm text-gray-600">
                Blockchain Transaction ID: <span className="font-mono">{transactionId}</span>
              </p>
              <button
                onClick={() => {
                  setShowInvestModal(false);
                  setTransactionId(null);
                  setInvestmentAmount('');
                  setError(null);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleDirectInvestment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="pl-8 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Minimum $10"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Estimated equity:{' '}
                  {investmentAmount
                    ? ((parseFloat(investmentAmount) / businessDetails.fundingGoal) * businessDetails.equityOffered).toFixed(2)
                    : '0'}
                  %
                </p>
              </div>
              {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">{error}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Investment
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleNegotiationSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={proposedAmount}
                  onChange={(e) => setProposedAmount(e.target.value)}
                  className="pl-8 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your offer"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Equity (%)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={proposedEquity}
                  onChange={(e) => setProposedEquity(e.target.value)}
                  className="w-full pr-8 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter equity percentage"
                  required
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Negotiation Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default InvestModal;