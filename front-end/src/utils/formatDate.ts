import { format, formatDistanceToNow, isAfter, isBefore, addDays, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (date: Date | string, formatStr = 'dd/MM/yyyy'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: vi });
};

export const formatDateTime = (date: Date | string): string => {
    return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatTimeAgo = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, {
        addSuffix: true,
        locale: vi
    });
};

export const isDateExpired = (date: Date | string): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return isBefore(dateObj, new Date());
};

export const isDateUpcoming = (date: Date | string, days = 7): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const futureDate = addDays(new Date(), days);
    return isAfter(dateObj, new Date()) && isBefore(dateObj, futureDate);
};

export const calculateNextEligibleDate = (lastDonationDate: Date | string, component = 'whole_blood'): Date => {
    const lastDate = typeof lastDonationDate === 'string' ? new Date(lastDonationDate) : lastDonationDate;

    const recoveryDays = {
        'whole_blood': 56,
        'red_blood_cells': 56,
        'plasma': 28,
        'platelets': 7
    };

    return addDays(lastDate, recoveryDays[component as keyof typeof recoveryDays] || 56);
};

export const getDaysBetween = (startDate: Date | string, endDate: Date | string): number => {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    return differenceInDays(end, start);
};

export const formatDateForInput = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'yyyy-MM-dd');
};

export const formatTimeForInput = (time: string): string => {
    // Convert HH:mm format to time input format
    return time;
};

export const getWeekdayName = (dayOfWeek: number): string => {
    const days = [
        'Chủ nhật',
        'Thứ hai',
        'Thứ ba',
        'Thứ tư',
        'Thứ năm',
        'Thứ sáu',
        'Thứ bảy'
    ];
    return days[dayOfWeek] || '';
};

export const getMonthName = (month: number): string => {
    const months = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
        'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
        'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[month] || '';
};
