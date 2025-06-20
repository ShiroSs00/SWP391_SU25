import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/helpers';

export interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  format?: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
  showTime?: boolean;
  locale?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  disabled = false,
  error,
  label,
  required = false,
  minDate,
  maxDate,
  className = '',
  format = 'dd/MM/yyyy',
  showTime = false,
  locale = 'vi-VN'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [selectedTime, setSelectedTime] = useState({
    hours: value?.getHours() || 0,
    minutes: value?.getMinutes() || 0
  });

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

  const formatDate = (date: Date): string => {
    if (!date) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'MM/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'yyyy-MM-dd':
        return `${year}-${month}-${day}`;
      default:
        return `${day}/${month}/${year}`;
    }
  };

  const formatDateTime = (date: Date): string => {
    const dateStr = formatDate(date);
    if (!showTime) return dateStr;

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${dateStr} ${hours}:${minutes}`;
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
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push(prevDate);
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
    if (!value) return false;
    return (
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear()
    );
  };

  const isDateInCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;

    let newDate = new Date(date);
    
    if (showTime) {
      newDate.setHours(selectedTime.hours);
      newDate.setMinutes(selectedTime.minutes);
    }

    onChange(newDate);
    if (!showTime) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = (type: 'hours' | 'minutes', value: number) => {
    const newTime = { ...selectedTime, [type]: value };
    setSelectedTime(newTime);

    if (value) {
      const newDate = new Date(value);
      newDate.setHours(newTime.hours);
      newDate.setMinutes(newTime.minutes);
      onChange(newDate);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-dark-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value ? formatDateTime(value) : ''}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'w-full px-4 py-3 pr-10 border rounded-xl transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blood-500/20 focus:border-blood-500',
            'cursor-pointer',
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-dark-300',
            disabled && 'bg-dark-50 cursor-not-allowed opacity-50'
          )}
        />
        
        <CalendarIcon 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" 
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-dark-200 rounded-xl shadow-xl z-50 p-4 min-w-[320px]">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-dark-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <h3 className="font-semibold text-dark-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-dark-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-dark-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                disabled={isDateDisabled(date)}
                className={cn(
                  'w-10 h-10 text-sm rounded-lg transition-all duration-200',
                  'hover:bg-blood-50 focus:outline-none focus:ring-2 focus:ring-blood-500/20',
                  isDateSelected(date) && 'bg-blood-600 text-white hover:bg-blood-700',
                  !isDateInCurrentMonth(date) && 'text-dark-300',
                  isDateDisabled(date) && 'text-dark-200 cursor-not-allowed hover:bg-transparent',
                  !isDateSelected(date) && isDateInCurrentMonth(date) && 'text-dark-900'
                )}
              >
                {date.getDate()}
              </button>
            ))}
          </div>

          {/* Time Picker */}
          {showTime && (
            <div className="mt-4 pt-4 border-t border-dark-200">
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <label className="text-sm text-dark-600 mb-2">Giờ</label>
                  <select
                    value={selectedTime.hours}
                    onChange={(e) => handleTimeChange('hours', Number(e.target.value))}
                    className="px-3 py-2 border border-dark-300 rounded-lg text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col items-center">
                  <label className="text-sm text-dark-600 mb-2">Phút</label>
                  <select
                    value={selectedTime.minutes}
                    onChange={(e) => handleTimeChange('minutes', Number(e.target.value))}
                    className="px-3 py-2 border border-dark-300 rounded-lg text-sm"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-dark-200">
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm text-dark-600 hover:bg-dark-100 rounded-lg transition-colors"
            >
              Xóa
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm bg-blood-600 text-white hover:bg-blood-700 rounded-lg transition-colors"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;