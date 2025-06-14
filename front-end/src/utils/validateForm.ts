import type { BloodType } from '../types';
import { BLOOD_TYPES, DONATION_ELIGIBILITY } from './constants';

export interface ValidationError {
    field: string;
    message: string;
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    // Vietnamese phone number validation
    const phoneRegex = /^(\+84|0)(3|5|7|8|9)([0-9]{8})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateAge = (dateOfBirth: string): { isValid: boolean; age: number } => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

    return {
        isValid: actualAge >= DONATION_ELIGIBILITY.MIN_AGE && actualAge <= DONATION_ELIGIBILITY.MAX_AGE,
        age: actualAge
    };
};

export const validateWeight = (weight: number): boolean => {
    return weight >= DONATION_ELIGIBILITY.MIN_WEIGHT;
};

export const validateBloodType = (bloodType: string): bloodType is BloodType => {
    return BLOOD_TYPES.includes(bloodType as BloodType);
};

export const validateHemoglobin = (hemoglobin: number, gender: 'male' | 'female'): boolean => {
    const minHemoglobin = gender === 'male'
        ? DONATION_ELIGIBILITY.MIN_HEMOGLOBIN_MALE
        : DONATION_ELIGIBILITY.MIN_HEMOGLOBIN_FEMALE;
    return hemoglobin >= minHemoglobin;
};

export const validateBloodPressure = (systolic: number, diastolic: number): boolean => {
    return systolic >= DONATION_ELIGIBILITY.MIN_SYSTOLIC_BP &&
        systolic <= DONATION_ELIGIBILITY.MAX_SYSTOLIC_BP &&
        diastolic >= DONATION_ELIGIBILITY.MIN_DIASTOLIC_BP &&
        diastolic <= DONATION_ELIGIBILITY.MAX_DIASTOLIC_BP;
};

export const validatePulse = (pulse: number): boolean => {
    return pulse >= DONATION_ELIGIBILITY.MIN_PULSE && pulse <= DONATION_ELIGIBILITY.MAX_PULSE;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateDonorRegistrationForm = (formData: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Personal information validation
    if (!formData?.personalInfo?.firstName?.trim()) {
        errors.push({ field: 'firstName', message: 'Họ là bắt buộc' });
    }

    if (!formData?.personalInfo?.lastName?.trim()) {
        errors.push({ field: 'lastName', message: 'Tên là bắt buộc' });
    }

    if (!formData?.personalInfo?.email) {
        errors.push({ field: 'email', message: 'Email là bắt buộc' });
    } else if (!validateEmail(formData.personalInfo.email)) {
        errors.push({ field: 'email', message: 'Email không hợp lệ' });
    }

    if (!formData?.personalInfo?.phone) {
        errors.push({ field: 'phone', message: 'Số điện thoại là bắt buộc' });
    } else if (!validatePhone(formData.personalInfo.phone)) {
        errors.push({ field: 'phone', message: 'Số điện thoại không hợp lệ' });
    }

    if (!formData?.personalInfo?.dateOfBirth) {
        errors.push({ field: 'dateOfBirth', message: 'Ngày sinh là bắt buộc' });
    } else {
        const ageValidation = validateAge(formData.personalInfo.dateOfBirth);
        if (!ageValidation.isValid) {
            errors.push({
                field: 'dateOfBirth',
                message: `Tuổi phải từ ${DONATION_ELIGIBILITY.MIN_AGE} đến ${DONATION_ELIGIBILITY.MAX_AGE}`
            });
        }
    }

    if (!formData?.personalInfo?.gender) {
        errors.push({ field: 'gender', message: 'Giới tính là bắt buộc' });
    }

    // Medical information validation
    if (!formData?.medicalInfo?.bloodType) {
        errors.push({ field: 'bloodType', message: 'Nhóm máu là bắt buộc' });
    } else if (!validateBloodType(formData.medicalInfo.bloodType)) {
        errors.push({ field: 'bloodType', message: 'Nhóm máu không hợp lệ' });
    }

    if (!formData?.medicalInfo?.weight || formData.medicalInfo.weight <= 0) {
        errors.push({ field: 'weight', message: 'Cân nặng là bắt buộc' });
    } else if (!validateWeight(formData.medicalInfo.weight)) {
        errors.push({
            field: 'weight',
            message: `Cân nặng tối thiểu ${DONATION_ELIGIBILITY.MIN_WEIGHT}kg`
        });
    }

    if (!formData?.medicalInfo?.height || formData.medicalInfo.height <= 0) {
        errors.push({ field: 'height', message: 'Chiều cao là bắt buộc' });
    }

    // Address validation
    if (!formData?.address?.street?.trim()) {
        errors.push({ field: 'street', message: 'Địa chỉ là bắt buộc' });
    }

    if (!formData?.address?.city?.trim()) {
        errors.push({ field: 'city', message: 'Thành phố là bắt buộc' });
    }

    if (!formData?.address?.province?.trim()) {
        errors.push({ field: 'province', message: 'Tỉnh/thành là bắt buộc' });
    }

    // Emergency contact validation
    if (!formData?.emergencyContact?.name?.trim()) {
        errors.push({ field: 'emergencyContactName', message: 'Tên người liên hệ khẩn cấp là bắt buộc' });
    }

    if (!formData?.emergencyContact?.phone) {
        errors.push({ field: 'emergencyContactPhone', message: 'Số điện thoại liên hệ khẩn cấp là bắt buộc' });
    } else if (!validatePhone(formData.emergencyContact.phone)) {
        errors.push({ field: 'emergencyContactPhone', message: 'Số điện thoại liên hệ khẩn cấp không hợp lệ' });
    }

    // Consent validation
    if (!formData?.consent) {
        errors.push({ field: 'consent', message: 'Bạn phải đồng ý với các điều khoản' });
    }

    return errors;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateBloodRequestForm = (formData: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Patient information validation
    if (!formData?.patientInfo?.name?.trim()) {
        errors.push({ field: 'patientName', message: 'Tên bệnh nhân là bắt buộc' });
    }

    if (!formData?.patientInfo?.bloodType) {
        errors.push({ field: 'patientBloodType', message: 'Nhóm máu bệnh nhân là bắt buộc' });
    } else if (!validateBloodType(formData.patientInfo.bloodType)) {
        errors.push({ field: 'patientBloodType', message: 'Nhóm máu không hợp lệ' });
    }

    if (!formData?.patientInfo?.age || formData.patientInfo.age <= 0) {
        errors.push({ field: 'patientAge', message: 'Tuổi bệnh nhân là bắt buộc' });
    }

    // Request details validation
    if (!formData?.requestDetails?.component) {
        errors.push({ field: 'component', message: 'Thành phần máu là bắt buộc' });
    }

    if (!formData?.requestDetails?.unitsRequired || formData.requestDetails.unitsRequired <= 0) {
        errors.push({ field: 'unitsRequired', message: 'Số đơn vị máu cần thiết phải lớn hơn 0' });
    }

    if (!formData?.requestDetails?.urgencyLevel) {
        errors.push({ field: 'urgencyLevel', message: 'Mức độ khẩn cấp là bắt buộc' });
    }

    if (!formData?.requestDetails?.requiredDate) {
        errors.push({ field: 'requiredDate', message: 'Ngày cần máu là bắt buộc' });
    } else {
        const requiredDate = new Date(formData.requestDetails.requiredDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requiredDate < today) {
            errors.push({ field: 'requiredDate', message: 'Ngày cần máu không thể là ngày trong quá khứ' });
        }
    }

    if (!formData?.requestDetails?.description?.trim()) {
        errors.push({ field: 'description', message: 'Mô tả tình trạng bệnh nhân là bắt buộc' });
    }

    // Hospital information validation
    if (!formData?.hospitalInfo?.name?.trim()) {
        errors.push({ field: 'hospitalName', message: 'Tên bệnh viện là bắt buộc' });
    }

    if (!formData?.hospitalInfo?.contactPerson?.trim()) {
        errors.push({ field: 'contactPerson', message: 'Người liên hệ là bắt buộc' });
    }

    if (!formData?.hospitalInfo?.phone) {
        errors.push({ field: 'hospitalPhone', message: 'Số điện thoại bệnh viện là bắt buộc' });
    } else if (!validatePhone(formData.hospitalInfo.phone)) {
        errors.push({ field: 'hospitalPhone', message: 'Số điện thoại bệnh viện không hợp lệ' });
    }

    return errors;
};

export const validateLoginForm = (email: string, password: string): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!email) {
        errors.push({ field: 'email', message: 'Email là bắt buộc' });
    } else if (!validateEmail(email)) {
        errors.push({ field: 'email', message: 'Email không hợp lệ' });
    }

    if (!password) {
        errors.push({ field: 'password', message: 'Mật khẩu là bắt buộc' });
    } else if (password.length < 6) {
        errors.push({ field: 'password', message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    return errors;
};

export const validatePassword = (password: string): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (password.length < 8) {
        errors.push({ field: 'password', message: 'Mật khẩu phải có ít nhất 8 ký tự' });
    }

    if (!/(?=.*[a-z])/.test(password)) {
        errors.push({ field: 'password', message: 'Mật khẩu phải có ít nhất 1 chữ thường' });
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        errors.push({ field: 'password', message: 'Mật khẩu phải có ít nhất 1 chữ hoa' });
    }

    if (!/(?=.*\d)/.test(password)) {
        errors.push({ field: 'password', message: 'Mật khẩu phải có ít nhất 1 số' });
    }

    return errors;
};
