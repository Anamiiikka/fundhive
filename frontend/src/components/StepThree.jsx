import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';

function StepThree({ formData, handleFileChange, loading }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Media</label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="media-upload"
            accept="image/*,video/*"
            disabled={loading}
          />
          <label
            htmlFor="media-upload"
            className={`cursor-pointer flex flex-col items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <span className="text-sm text-gray-600">Click to upload image or video</span>
            <span className="text-xs text-gray-500 mt-2">Max file size: 50MB</span>
          </label>
          {formData.media && (
            <div className="mt-4 text-sm text-gray-600">Selected: {formData.media.name}</div>
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
  );
}

export default StepThree;