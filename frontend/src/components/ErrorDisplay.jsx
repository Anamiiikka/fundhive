import React from 'react';

function ErrorDisplay({ error }) {
  if (!error) return null;
  return <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
}

export default ErrorDisplay;