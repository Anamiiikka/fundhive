import React from 'react';

function FormActions({ step, setStep, handleSubmit, loading }) {
  return (
    <div className="p-6 border-t bg-gray-50 rounded-b-lg">
      <div className="flex justify-between">
        <button
          onClick={() => setStep(step - 1)}
          className={`px-6 py-2 rounded-lg ${
            step === 1 ? 'invisible' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          Back
        </button>
        {step === 3 ? (
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        ) : (
          <button
            onClick={() => setStep(step + 1)}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default FormActions;