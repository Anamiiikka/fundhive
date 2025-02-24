import React from 'react';
import { X } from 'lucide-react';

function InvestModal({ showInvestModal, setShowInvestModal, businessDetails, investmentAmount, setInvestmentAmount, handleInvest }) {
  if (!showInvestModal) return null;

  return (
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
  );
}

export default InvestModal;