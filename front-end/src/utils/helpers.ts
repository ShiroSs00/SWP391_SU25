import { Gender, BloodTypeABO, BloodTypeRh } from './enums';

// Date formatters
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    return dateObj.toLocaleDateString('vi-VN', { ...defaultOptions, ...options });
};

export const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}`;
};

// Number formatters
export const formatNumber = (num: number, decimals: number = 0): string => {
    return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
};

export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100);
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} phút`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours} giờ`;
    }

    return `${hours} giờ ${remainingMinutes} phút`;
};

// Text formatters
export const formatName = (firstName: string, lastName: string): string => {
    return `${lastName} ${firstName}`.trim();
};

export const formatInitials = (firstName: string, lastName: string): string => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${lastInitial}${firstInitial}`;
};

export const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Format Vietnamese phone numbers
    if (cleaned.startsWith('84')) {
        // International format: +84 xxx xxx xxx
        const number = cleaned.substring(2);
        return `+84 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    } else if (cleaned.startsWith('0')) {
        // Domestic format: 0xxx xxx xxx
        return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
    }

    return phone; // Return original if format not recognized
};

export const formatAddress = (address: string, city: string, country: string = 'Việt Nam'): string => {
    return [address, city, country].filter(Boolean).join(', ');
};

// Blood type formatters
export const formatBloodType = (abo: BloodTypeABO, rh: BloodTypeRh): string => {
    return `${abo}${rh}`;
};

export const formatBloodTypeDisplay = (abo: BloodTypeABO, rh: BloodTypeRh): string => {
    const rhDisplay = rh === '+' ? 'dương' : 'âm';
    return `${abo} ${rhDisplay}`;
};

export const formatBloodVolume = (volume: number, unit: 'ml' | 'l' = 'ml'): string => {
    if (unit === 'l') {
        return `${(volume / 1000).toFixed(1)}L`;
    }
    return `${volume}ml`;
};

// Medical formatters
export const formatWeight = (weight: number): string => {
    return `${weight}kg`;
};

export const formatHeight = (height: number): string => {
    return `${height}cm`;
};

export const formatBMI = (bmi: number): string => {
    return bmi.toFixed(1);
};

export const formatBloodPressure = (systolic: number, diastolic: number): string => {
    return `${systolic}/${diastolic} mmHg`;
};

export const formatTemperature = (temp: number): string => {
    return `${temp.toFixed(1)}°C`;
};

export const formatHeartRate = (rate: number): string => {
    return `${rate} bpm`;
};

export const formatHemoglobin = (level: number): string => {
    return `${level.toFixed(1)} g/dL`;
};

// Status formatters
export const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        pending: 'Đang chờ',
        approved: 'Đã duyệt',
        rejected: 'Từ chối',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy',
        scheduled: 'Đã lên lịch',
        in_progress: 'Đang thực hiện',
        available: 'Có sẵn',
        reserved: 'Đã đặt',
        used: 'Đã sử dụng',
        expired: 'Hết hạn'
    };

    return statusMap[status] || status;
};

export const formatPriority = (priority: string): string => {
    const priorityMap: Record<string, string> = {
        low: 'Thấp',
        medium: 'Trung bình',
        high: 'Cao',
        critical: 'Nghiêm trọng',
        emergency: 'Khẩn cấp'
    };

    return priorityMap[priority] || priority;
};

export const formatGender = (gender: Gender): string => {
    const genderMap: Record<Gender, string> = {
        [Gender.MALE]: 'Nam',
        [Gender.FEMALE]: 'Nữ',
        [Gender.OTHER]: 'Khác',
        [Gender.PREFER_NOT_TO_SAY]: 'Không muốn tiết lộ'
    };

    return genderMap[gender] || gender;
};

// List formatters
export const formatList = (items: string[], conjunction: string = 'và'): string => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

    const lastItem = items[items.length - 1];
    const otherItems = items.slice(0, -1);

    return `${otherItems.join(', ')} ${conjunction} ${lastItem}`;
};

export const formatTags = (tags: string[]): string => {
    return tags.map(tag => `#${tag}`).join(' ');
};

// Distance formatter
export const formatDistance = (distance: number): string => {
    if (distance < 1) {
        return `${Math.round(distance * 1000)}m`;
    }

    return `${distance.toFixed(1)}km`;
};

// Age formatter
export const formatAge = (birthDate: string): string => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return `${age} tuổi`;
};

// Relative time formatter
export const formatRelativeTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) return 'vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
    return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
};

// Countdown formatter
export const formatCountdown = (targetDate: Date | string): string => {
    const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    const now = new Date();
    const diffInSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);

    if (diffInSeconds <= 0) return 'Đã hết hạn';

    const days = Math.floor(diffInSeconds / 86400);
    const hours = Math.floor((diffInSeconds % 86400) / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);

    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
};

// Score formatter
export const formatScore = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    return `${score}/${maxScore} (${percentage.toFixed(0)}%)`;
};

// Achievement formatter
export const formatAchievementProgress = (current: number, target: number): string => {
    const percentage = Math.min((current / target) * 100, 100);
    return `${current}/${target} (${percentage.toFixed(0)}%)`;
};

// Error message formatter
export const formatErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    return 'Đã xảy ra lỗi không xác định';
};

// Validation message formatter
export const formatValidationErrors = (errors: Record<string, string[]>): string[] => {
    const messages: string[] = [];

    Object.entries(errors).forEach(([field, fieldErrors]) => {
        fieldErrors.forEach(error => {
            messages.push(`${field}: ${error}`);
        });
    });

    return messages;
};