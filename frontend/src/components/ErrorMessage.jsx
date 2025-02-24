import React from 'react';
import { AlertCircle } from 'lucide-react';

function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
      <AlertCircle className="w-5 h-5 mr-2" />
      {error}
    </div>
  );
}

export default ErrorMessage;