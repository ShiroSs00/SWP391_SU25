import React from 'react';
import { Calendar, Search, RotateCcw } from 'lucide-react';

interface EventFiltersProps {
  dateFilter: { start: string; end: string };
  onDateFilterChange: (name: string, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  dateFilter,
  onDateFilterChange,
  onSearch,
  onReset,
  isLoading = false
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-medium">Lọc theo ngày kết thúc:</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFilter.start}
              onChange={(e) => onDateFilterChange('start', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
            <span className="text-gray-400">đến</span>
            <input
              type="date"
              value={dateFilter.end}
              onChange={(e) => onDateFilterChange('end', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onSearch}
              disabled={isLoading || !dateFilter.start || !dateFilter.end}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <Search className="w-4 h-4" />
              Tìm kiếm
            </button>
            <button
              onClick={onReset}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Đặt lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;