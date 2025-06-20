import { BloodTypeABO, BloodTypeRh, Gender } from './enums';
import { DONATION_CONFIG, VIETNAM_PROVINCES } from './constants';

// Email validation
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone number validation (Vietnam format)
export const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^(\+84|84|0)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password validation
export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Mật khẩu phải có ít nhất 8 ký tự');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
    }

    if (!/\d/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 số');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// National ID validation (Vietnam CCCD/CMND)
export const validateNationalId = (id: string): boolean => {
    // CCCD: 12 digits, CMND: 9 digits
    const cccdRegex = /^\d{12}$/;
    const cmndRegex = /^\d{9}$/;
    return cccdRegex.test(id) || cmndRegex.test(id);
};

// Date validation
export const validateDate = (date: string): boolean => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Age validation for blood donation
export const validateDonorAge = (birthDate: string): {
    isValid: boolean;
    age: number;
    error?: string;
} => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
        ? age - 1
        : age;

    if (actualAge < DONATION_CONFIG.MIN_AGE) {
        return {
            isValid: false,
            age: actualAge,
            error: `Tuổi tối thiểu để hiến máu là ${DONATION_CONFIG.MIN_AGE}`
        };
    }

    if (actualAge > DONATION_CONFIG.MAX_AGE) {
        return {
            isValid: false,
            age: actualAge,
            error: `Tuổi tối đa để hiến máu là ${DONATION_CONFIG.MAX_AGE}`
        };
    }

    return {
        isValid: true,
        age: actualAge
    };
};

// Weight validation for blood donation
export const validateDonorWeight = (weight: number): {
    isValid: boolean;
    error?: string;
} => {
    if (weight < DONATION_CONFIG.MIN_WEIGHT) {
        return {
            isValid: false,
            error: `Cân nặng tối thiểu để hiến máu là ${DONATION_CONFIG.MIN_WEIGHT}kg`
        };
    }

    return { isValid: true };
};

// Hemoglobin validation
export const validateHemoglobin = (hemoglobin: number, gender: Gender): {
    isValid: boolean;
    error?: string;
} => {
    const minHemoglobin = gender === Gender.MALE
        ? DONATION_CONFIG.MIN_HEMOGLOBIN_MALE
        : DONATION_CONFIG.MIN_HEMOGLOBIN_FEMALE;

    if (hemoglobin < minHemoglobin) {
        return {
            isValid: false,
            error: `Nồng độ hemoglobin tối thiểu là ${minHemoglobin}g/dL`
        };
    }

    return { isValid: true };
};

// Blood type validation
export const validateBloodType = (abo: string, rh: string): {
    isValid: boolean;
    error?: string;
} => {
    if (!Object.values(BloodTypeABO).includes(abo as BloodTypeABO)) {
        return {
            isValid: false,
            error: 'Nhóm máu ABO không hợp lệ'
        };
    }

    if (!Object.values(BloodTypeRh).includes(rh as BloodTypeRh)) {
        return {
            isValid: false,
            error: 'Nhóm máu Rh không hợp lệ'
        };
    }

    return { isValid: true };
};

// Address validation
export const validateAddress = (address: string, city: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (!address || address.trim().length < 10) {
        errors.push('Địa chỉ phải có ít nhất 10 ký tự');
    }

    if (!city || !VIETNAM_PROVINCES.includes(city as any)) {
        errors.push('Tỉnh/Thành phố không hợp lệ');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// File validation
export const validateFile = (file: File, maxSize: number, allowedTypes: string[]): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (file.size > maxSize) {
        errors.push(`Kích thước file không được vượt quá ${maxSize / (1024 * 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
        errors.push('Định dạng file không được hỗ trợ');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// URL validation
export const validateUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Required field validation
export const validateRequired = (value: any, fieldName: string): {
    isValid: boolean;
    error?: string;
} => {
    if (value === null || value === undefined || value === '') {
        return {
            isValid: false,
            error: `${fieldName} là bắt buộc`
        };
    }

    return { isValid: true };
};

// String length validation
export const validateLength = (
    value: string,
    min: number,
    max: number,
    fieldName: string
): {
    isValid: boolean;
    error?: string;
} => {
    if (value.length < min) {
        return {
            isValid: false,
            error: `${fieldName} phải có ít nhất ${min} ký tự`
        };
    }

    if (value.length > max) {
        return {
            isValid: false,
            error: `${fieldName} không được vượt quá ${max} ký tự`
        };
    }

    return { isValid: true };
};

// Number range validation
export const validateRange = (
    value: number,
    min: number,
    max: number,
    fieldName: string
): {
    isValid: boolean;
    error?: string;
} => {
    if (value < min) {
        return {
            isValid: false,
            error: `${fieldName} phải lớn hơn hoặc bằng ${min}`
        };
    }

    if (value > max) {
        return {
            isValid: false,
            error: `${fieldName} phải nhỏ hơn hoặc bằng ${max}`
        };
    }

    return { isValid: true };
};

// Form validation helper
export const validateForm = (data: Record<string, any>, rules: Record<string, any[]>): {
    isValid: boolean;
    errors: Record<string, string[]>;
} => {
    const errors: Record<string, string[]> = {};

    Object.keys(rules).forEach(field => {
        const fieldRules = rules[field];
        const fieldErrors: string[] = [];

        fieldRules.forEach(rule => {
            const result = rule(data[field]);
            if (!result.isValid) {
                if (result.error) fieldErrors.push(result.error);
                if (result.errors) fieldErrors.push(...result.errors);
            }
        });

        if (fieldErrors.length > 0) {
            errors[field] = fieldErrors;
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Donation eligibility validation
export const validateDonationEligibility = (data: {
    age: number;
    weight: number;
    hemoglobin: number;
    gender: Gender;
    lastDonationDate?: string;
    medicalConditions: string[];
}): {
    isEligible: boolean;
    reasons: string[];
} => {
    const reasons: string[] = [];

    // Age check
    if (data.age < DONATION_CONFIG.MIN_AGE || data.age > DONATION_CONFIG.MAX_AGE) {
        reasons.push(`Tuổi phải từ ${DONATION_CONFIG.MIN_AGE} đến ${DONATION_CONFIG.MAX_AGE}`);
    }

    // Weight check
    if (data.weight < DONATION_CONFIG.MIN_WEIGHT) {
        reasons.push(`Cân nặng tối thiểu ${DONATION_CONFIG.MIN_WEIGHT}kg`);
    }

    // Hemoglobin check
    const minHemoglobin = data.gender === Gender.MALE
        ? DONATION_CONFIG.MIN_HEMOGLOBIN_MALE
        : DONATION_CONFIG.MIN_HEMOGLOBIN_FEMALE;

    if (data.hemoglobin < minHemoglobin) {
        reasons.push(`Nồng độ hemoglobin tối thiểu ${minHemoglobin}g/dL`);
    }

    // Last donation interval check
    if (data.lastDonationDate) {
        const lastDonation = new Date(data.lastDonationDate);
        const daysSinceLastDonation = Math.floor(
            (Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastDonation < DONATION_CONFIG.INTERVALS.WHOLE_BLOOD) {
            const nextEligibleDate = new Date(lastDonation);
            nextEligibleDate.setDate(nextEligibleDate.getDate() + DONATION_CONFIG.INTERVALS.WHOLE_BLOOD);
            reasons.push(`Có thể hiến máu tiếp theo từ ${nextEligibleDate.toLocaleDateString('vi-VN')}`);
        }
    }

    // Medical conditions check (basic)
    const disqualifyingConditions = [
        'hiv', 'hepatitis', 'heart_disease', 'diabetes_insulin', 'cancer'
    ];

    const hasDisqualifyingCondition = data.medicalConditions.some(condition =>
        disqualifyingConditions.includes(condition.toLowerCase())
    );

    if (hasDisqualifyingCondition) {
        reasons.push('Có tình trạng sức khỏe không phù hợp để hiến máu');
    }

    return {
        isEligible: reasons.length === 0,
        reasons
    };
};