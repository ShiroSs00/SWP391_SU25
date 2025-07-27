import type { CreateFeedbackRequest } from '../types/feedback.types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateFeedbackForm = (data: CreateFeedbackRequest): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate rating fields (1-5)
  const ratingFields = [
    { field: 'process', label: 'Quy trình hiến máu' },
    { field: 'bloodTest', label: 'Xét nghiệm máu' },
    { field: 'postDonationCare', label: 'Chăm sóc sau hiến máu' },
    { field: 'comfortable', label: 'Sự thoải mái' },
    { field: 'overallSatisfaction', label: 'Mức độ hài lòng chung' }
  ];

  ratingFields.forEach(({ field, label }) => {
    const value = data[field as keyof CreateFeedbackRequest] as number;
    if (!value || !Number.isInteger(value) || value < 1 || value > 5) {
      errors.push({
        field,
        message: `Vui lòng đánh giá ${label.toLowerCase()} từ 1 đến 5 sao`
      });
    }
  });

  // Validate description
  if (!data.description || data.description.trim().length === 0) {
    errors.push({
      field: 'description',
      message: 'Vui lòng mô tả chi tiết cảm nhận của bạn'
    });
  } else if (data.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Mô tả phải có ít nhất 10 ký tự'
    });
  } else if (data.description.length > 1000) {
    errors.push({
      field: 'description',
      message: 'Mô tả không được vượt quá 1000 ký tự'
    });
  }

  return errors;
};

export const validateRegistrationId = (registrationId: string): string | null => {
  if (!registrationId || registrationId.trim().length === 0) {
    return 'Mã đăng ký không được để trống';
  }
  
  // Basic format validation
  if (registrationId.length < 3) {
    return 'Mã đăng ký không hợp lệ';
  }
  
  // Remove special characters that might cause issues
  const cleanId = registrationId.replace(/[^a-zA-Z0-9-_]/g, '');
  if (cleanId !== registrationId) {
    return 'Mã đăng ký chứa ký tự không hợp lệ';
  }
  
  return null;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

export const validateRating = (rating: number): boolean => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Có lỗi xảy ra. Vui lòng thử lại sau.';
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};