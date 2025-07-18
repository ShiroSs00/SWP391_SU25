import React from 'react';
import { History, Droplet } from 'lucide-react';
import HistoryTable from '../components/HistoryTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { DonationRecord } from '../types/dashboard.type';

interface HistoryPageProps {
  donationHistory: DonationRecord[];
  receivingHistory: DonationRecord[];
  historyTab: 'donation' | 'receiving';
  loading: boolean;
  error: string | null;
  onTabChange: (tab: 'donation' | 'receiving') => void;
  onFeedback: (recordId: string) => void;
  onRetry: () => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({
  donationHistory,
  receivingHistory,
  historyTab,
  loading,
  error,
  onTabChange,
  onFeedback,
  onRetry
}) => {
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
            onClick={() => onTabChange('donation')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              historyTab === 'donation'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>Hiến máu ({donationHistory.length})</span>
          </button>
          <button
            onClick={() => onTabChange('receiving')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              historyTab === 'receiving'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>Nhận máu ({receivingHistory.length})</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <HistoryTable
          records={historyTab === 'donation' ? donationHistory : receivingHistory}
          type={historyTab}
          onFeedback={onFeedback}
        />
      </div>
    </div>
  );
};

export default HistoryPage;