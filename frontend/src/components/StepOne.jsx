import React from 'react';

function StepOne({ formData, setFormData, loading }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your project title"
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          placeholder="Describe your project"
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        >
          <option value="">Select a category</option>
          <option value="tech">Technology</option>
          <option value="business">Business</option>
          <option value="software">Software</option>
          <option value="sustainability">Green Tech</option>
          <option value="creative">Creative</option>
        </select>
      </div>
    </div>
  );
}

export default StepOne;