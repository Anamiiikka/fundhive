import React, { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';

export function CreateProject({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    fundingGoal: '',
    equityOffered: '',
    duration: '30',
    media: null
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, media: e.target.files[0] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Project data:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Create New Project</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between relative">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                    step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {i}
                </div>
              ))}
              <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your project title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    placeholder="Describe your project"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Goal (USD)
                  </label>
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
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Equity Offered (%)
                  </label>
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
                    />
                    <span className="absolute right-3 top-2 text-gray-500">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Duration (Days)
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Media
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="media-upload"
                      accept="image/*,video/*"
                    />
                    <label
                      htmlFor="media-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <span className="text-sm text-gray-600">
                        Click to upload image or video
                      </span>
                      <span className="text-xs text-gray-500 mt-2">
                        Max file size: 50MB
                      </span>
                    </label>
                    {formData.media && (
                      <div className="mt-4 text-sm text-gray-600">
                        Selected: {formData.media.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-600">
                    <p className="font-medium">Before you submit:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Ensure all information is accurate</li>
                      <li>Review funding goal and equity offering</li>
                      <li>Check media quality and relevance</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-lg">
          <div className="flex justify-between">
            <button
              onClick={() => setStep(step - 1)}
              className={`px-6 py-2 rounded-lg ${
                step === 1
                  ? 'invisible'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Back
            </button>
            {step === 3 ? (
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Project
              </button>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}