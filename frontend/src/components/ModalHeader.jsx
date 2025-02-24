import React from 'react';
import { X } from 'lucide-react';

function ModalHeader({ onClose }) {
  return (
    <div className="p-6 border-b">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Create New Project</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default ModalHeader;