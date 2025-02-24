import React from 'react';

function StepTwo({ formData, setFormData, loading }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Funding Goal (USD)</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            value={formData.fundingGoal}
            onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter funding goal"
            min="1000"
            required
            disabled={loading}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Equity Offered (%)</label>
        <div className="relative">
          <input
            type="number"
            value={formData.equityOffered}
            onChange={(e) => setFormData({ ...formData, equityOffered: e.target.value })}
            className="w-full pr-8 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter equity percentage"
            min="0.1"
            max="100"
            step="0.1"
            required
            disabled={loading}
          />
          <span className="absolute right-3 top-2 text-gray-500">%</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Duration (Days)</label>
        <select
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        >
          <option value="30">30 days</option>
          <option value="60">60 days</option>
          <option value="90">90 days</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Number</label>
        <input
          type="text"
          value={formData.panCard}
          onChange={(e) => setFormData({ ...formData, panCard: e.target.value.toUpperCase() })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., ABCDE1234F"
          maxLength={10}
          required
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter a valid 10-character PAN Card number (5 letters, 4 numbers, 1 letter)
        </p>
      </div>
    </div>
  );
}

export default StepTwo;