// components/FeedbackModal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;