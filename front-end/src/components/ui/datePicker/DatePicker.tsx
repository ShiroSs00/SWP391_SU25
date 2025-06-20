import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DatePickerProps {
    value?: Date;
    onChange: (date: Date) => void;
    label?: string;
    error?: string;
    minDate?: Date;
    maxDate?: Date;
    placeholder?: string;
    disabled?: boolean;
    showBloodDonationEligibility?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   value,
                                                   onChange,
                                                   label,
                                                   error,
                                                   minDate,
                                                   maxDate,
                                                   placeholder = 'Select date',
                                                   disabled = false,
                                                   showBloodDonationEligibility = false
                                               }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentMonth, setCurrentMonth] = React.useState(value || new Date());
    const [inputValue, setInputValue] = React.useState(value ? formatDate(value) : '');

    function formatDate(date: Date): string {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    function isDateDisabled(date: Date): boolean {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    }

    function isEligibleForDonation(lastDonationDate: Date): boolean {
        const today = new Date();
        const daysSinceLastDonation = Math.floor((today.getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceLastDonation >= 56; // 8 weeks between donations
    }

    function getNextEligibleDate(lastDonationDate: Date): Date {
        const nextDate = new Date(lastDonationDate);
        nextDate.setDate(nextDate.getDate() + 56);
        return nextDate;
    }

    const handleDateSelect = (date: Date) => {
        onChange(date);
        setInputValue(formatDate(date));
        setIsOpen(false);
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(currentMonth);
        if (direction === 'prev') {
            newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
            newMonth.setMonth(newMonth.getMonth() + 1);
        }
        setCurrentMonth(newMonth);
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const eligibilityInfo = showBloodDonationEligibility && value ? {
        isEligible: isEligibleForDonation(value),
        nextEligibleDate: getNextEligibleDate(value)
    } : null;

    return (
        <div className="relative w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer ${
                        error ? 'border-red-500' : 'border-gray-300'
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-full min-w-80">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h3 className="font-semibold text-gray-900">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => (
                            <button
                                key={index}
                                disabled={!day || isDateDisabled(day)}
                                onClick={() => day && handleDateSelect(day)}
                                className={`p-2 text-sm rounded-md transition-colors duration-200 ${
                                    !day
                                        ? 'invisible'
                                        : isDateDisabled(day)
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : value && day.toDateString() === value.toDateString()
                                                ? 'bg-red-600 text-white'
                                                : 'hover:bg-red-50 text-gray-900'
                                }`}
                            >
                                {day?.getDate()}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}

            {eligibilityInfo && (
                <div className={`mt-2 p-3 rounded-lg ${
                    eligibilityInfo.isEligible ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                    <p className={`text-sm font-medium ${
                        eligibilityInfo.isEligible ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                        {eligibilityInfo.isEligible
                            ? '✓ Eligible for blood donation'
                            : `Next eligible date: ${formatDate(eligibilityInfo.nextEligibleDate)}`
                        }
                    </p>
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default DatePicker;