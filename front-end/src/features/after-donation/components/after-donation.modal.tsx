import React from 'react';
import AfterDonationCreateForm from './after-donation.createform';

interface AfterDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthCheckId: string;
  onSuccess?: () => void;
}

const AfterDonationModal: React.FC<AfterDonationModalProps> = ({
  isOpen,
  onClose,
  healthCheckId,
  onSuccess
}) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Phân Tích Máu
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Health Check ID: <span className="font-medium text-blue-600">{healthCheckId}</span>
              </p>
            </div>
            
            <AfterDonationCreateForm
              healthCheckId={healthCheckId}
              onSuccess={handleSuccess}
              onCancel={onClose}
              isModal={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterDonationModal;
