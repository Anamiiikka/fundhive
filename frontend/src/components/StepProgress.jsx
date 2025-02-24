import React from 'react';

function StepProgress({ step }) {
  return (
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
  );
}

export default StepProgress;