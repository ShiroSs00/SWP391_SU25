import React, { useCallback } from 'react';
import { History, Droplet } from 'lucide-react';
import HistoryTable from '../components/HistoryTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { DonationRecord, DonorFeedback } from '../types/dashboard.type';

interface HistoryPageProps {
  donationHistory: DonationRecord[];
  receivingHistory: DonationRecord[];
  historyTab: 'donation' | 'receiving';
  loading: boolean;
  error: string | null;
  onTabChange: (tab: 'donation' | 'receiving') => void;
  onFeedback: (recordId: string, feedbackData?: DonorFeedback) => void; // Cập nhật để khớp với HistoryTable
  onRetry: () => void;
  onEditBloodRequest?: (recordId: string) => void; // Thêm prop tùy chọn
  onRefresh?: () => void; // Thêm prop tùy chọn
}

const HistoryPage: React.FC<HistoryPageProps> = ({
  donationHistory,
  receivingHistory,
  historyTab,
  loading,
  error,
  onTabChange,
  onFeedback,
  onRetry,
  onEditBloodRequest,
  onRefresh,
}) => {
  // Xử lý thay đổi tab
  const handleTabChange = useCallback((tab: 'donation' | 'receiving') => {
    onTabChange(tab);
  }, [onTabChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  const currentRecords = historyTab === 'donation' ? donationHistory : receivingHistory;
  const hasRecords = currentRecords.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Lịch sử máu</h1>
            <p className="text-gray-600">Theo dõi lịch sử hiến máu và nhận máu của bạn</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleTabChange('donation')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              historyTab === 'donation'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={loading}
          >
            <Droplet className="w-4 h-4" />
            <span>Hiến máu ({donationHistory.length})</span>
          </button>
          <button
            onClick={() => handleTabChange('receiving')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              historyTab === 'receiving'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={loading}
          >
            <Droplet className="w-4 h-4" />
            <span>Nhận máu ({receivingHistory.length})</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {hasRecords ? (
          <HistoryTable
            records={currentRecords}
            type={historyTab}
            onFeedback={onFeedback}
            onEditBloodRequest={onEditBloodRequest}
            onRefresh={onRefresh}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Droplet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>
              {historyTab === 'donation'
                ? 'Chưa có lịch sử hiến máu.'
                : 'Chưa có lịch sử nhận máu.'}
            </p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Làm mới
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;