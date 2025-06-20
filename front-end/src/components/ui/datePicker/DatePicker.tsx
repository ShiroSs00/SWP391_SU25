import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/helpers';
import { formatDate } from '../../../utils/helpers';

export interface DatePickerProps {
  value?: Date | string;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  locale?: string;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  disabled = false,
  minDate,
  maxDate,
  dateFormat = 'dd/MM/yyyy',
  locale = 'vi-VN',
  className = '',
  error,
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? (typeof value === 'string' ? new Date(value) : value) : null
  );
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const date = typeof value === 'string' ? new Date(value) : value;
      setSelectedDate(date);
      setCurrentMonth(date);
    }
  }, [value]);

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return '';
    return formatDate(date, locale);
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(new Date(year, month, -startingDayOfWeek + i + 1));
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Add days from next month to fill the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push(new Date(year, month + 1, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isDateInCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    setSelectedDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange(null);
    setIsOpen(false);
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-dark-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={formatDisplayDate(selectedDate)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'w-full px-4 py-3 pr-10 border border-dark-300 rounded-xl',
            'focus:outline-none focus:ring-2 focus:ring-blood-500 focus:border-blood-500',
            'disabled:bg-dark-100 disabled:cursor-not-allowed',
            'cursor-pointer transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500'
          )}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <CalendarIcon className="w-5 h-5 text-dark-400" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-dark-200 rounded-xl shadow-lg z-50 animate-slide-down">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-200">
            <button
              type="button"
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-dark-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-dark-600" />
            </button>
            
            <div className="text-lg font-semibold text-dark-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-dark-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-dark-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-sm font-medium text-dark-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((date, index) => {
                const isSelected = isDateSelected(date);
                const isDisabled = isDateDisabled(date);
                const isCurrentMonth = isDateInCurrentMonth(date);
                const isTodayDate = isToday(date);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    disabled={isDisabled}
                    className={cn(
                      'h-8 w-8 flex items-center justify-center text-sm rounded-lg transition-all duration-200',
                      'hover:bg-blood-50 focus:outline-none focus:ring-2 focus:ring-blood-500',
                      isSelected && 'bg-blood-600 text-white hover:bg-blood-700',
                      !isSelected && isTodayDate && 'bg-blood-100 text-blood-700 font-semibold',
                      !isCurrentMonth && 'text-dark-400',
                      isDisabled && 'text-dark-300 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendar Footer */}
          <div className="flex items-center justify-between p-4 border-t border-dark-200">
            <button
              type="button"
              onClick={() => handleDateSelect(new Date())}
              className="text-sm text-blood-600 hover:text-blood-700 font-medium"
            >
              Hôm nay
            </button>
            
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-dark-600 hover:text-dark-700"
            >
              Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;