export interface ValidationError {
  field: string;
  message: string;
}

export const validateFeedbackForm = (data: {
  process: number;
  bloodTest: number;
  postDonationCare: number;
  comfortable: number;
  overallSatisfaction: number;
  description: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Kiểm tra rating (1-5)
  const ratingFields = [
    { field: 'process', value: data.process, label: 'Đánh giá quy trình' },
    { field: 'bloodTest', value: data.bloodTest, label: 'Đánh giá xét nghiệm' },
    { field: 'postDonationCare', value: data.postDonationCare, label: 'Đánh giá chăm sóc sau hiến' },
    { field: 'comfortable', value: data.comfortable, label: 'Đánh giá sự thoải mái' },
    { field: 'overallSatisfaction', value: data.overallSatisfaction, label: 'Đánh giá tổng thể' },
  ];

  ratingFields.forEach(({ field, value, label }) => {
    if (!value || value < 1 || value > 5) {
      errors.push({
        field,
        message: `${label} phải từ 1 đến 5 sao`,
      });
    }
  });

  // Kiểm tra mô tả
  if (!data.description || data.description.trim().length === 0) {
    errors.push({
      field: 'description',
      message: 'Vui lòng nhập mô tả cảm nhận',
    });
  } else if (data.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Mô tả phải có ít nhất 10 ký tự',
    });
  } else if (data.description.trim().length > 1000) {
    errors.push({
      field: 'description',
      message: 'Mô tả không được vượt quá 1000 ký tự',
    });
  }

  return errors;
};

export const validateStaffReply = (reply: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!reply || reply.trim().length === 0) {
    errors.push({
      field: 'staffReply',
      message: 'Vui lòng nhập phản hồi',
    });
  } else if (reply.trim().length < 5) {
    errors.push({
      field: 'staffReply',
      message: 'Phản hồi phải có ít nhất 5 ký tự',
    });
  } else if (reply.trim().length > 500) {
    errors.push({
      field: 'staffReply',
      message: 'Phản hồi không được vượt quá 500 ký tự',
    });
  }

  return errors;
};

export const validateRegistrationId = (registrationId: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!registrationId || registrationId.trim().length === 0) {
    errors.push({
      field: 'registrationId',
      message: 'Mã đăng ký không được để trống',
    });
  }

  return errors;
};