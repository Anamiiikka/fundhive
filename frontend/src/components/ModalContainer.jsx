import React from 'react';

function ModalContainer({ children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">{children}</div>
    </div>
  );
}

export default ModalContainer;