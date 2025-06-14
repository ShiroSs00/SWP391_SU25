import type { BloodType, BloodCompatibility, BloodComponent } from '../types';

// Blood Type Constants
export const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_COMPONENTS: BloodComponent[] = [
  'whole_blood',
  'red_blood_cells',
  'plasma',
  'platelets'
];

// Blood Compatibility Rules for Whole Blood Transfusion
export const BLOOD_COMPATIBILITY: Record<BloodType, BloodCompatibility> = {
  'O-': {
    donor: ['O-'],
    recipient: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
  },
  'O+': {
    donor: ['O-', 'O+'],
    recipient: ['O+', 'A+', 'B+', 'AB+']
  },
  'A-': {
    donor: ['O-', 'A-'],
    recipient: ['A-', 'A+', 'AB-', 'AB+']
  },
  'A+': {
    donor: ['O-', 'O+', 'A-', 'A+'],
    recipient: ['A+', 'AB+']
  },
  'B-': {
    donor: ['O-', 'B-'],
    recipient: ['B-', 'B+', 'AB-', 'AB+']
  },
  'B+': {
    donor: ['O-', 'O+', 'B-', 'B+'],
    recipient: ['B+', 'AB+']
  },
  'AB-': {
    donor: ['O-', 'A-', 'B-', 'AB-'],
    recipient: ['AB-', 'AB+']
  },
  'AB+': {
    donor: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    recipient: ['AB+']
  }
};

// Blood Component Compatibility Rules
export const COMPONENT_COMPATIBILITY = {
  // Red Blood Cells - same as whole blood
  red_blood_cells: BLOOD_COMPATIBILITY,

  // Plasma - opposite compatibility
  plasma: {
    'AB+': {
      donor: ['AB+'],
      recipient: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
    },
    'AB-': {
      donor: ['AB-', 'AB+'],
      recipient: ['O-', 'A-', 'B-', 'AB-']
    },
    'A+': {
      donor: ['A+', 'AB+'],
      recipient: ['O+', 'A+']
    },
    'A-': {
      donor: ['A-', 'A+', 'AB-', 'AB+'],
      recipient: ['O-', 'O+', 'A-', 'A+']
    },
    'B+': {
      donor: ['B+', 'AB+'],
      recipient: ['O+', 'B+']
    },
    'B-': {
      donor: ['B-', 'B+', 'AB-', 'AB+'],
      recipient: ['O-', 'O+', 'B-', 'B+']
    },
    'O+': {
      donor: ['O+', 'A+', 'B+', 'AB+'],
      recipient: ['O+']
    },
    'O-': {
      donor: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      recipient: ['O-']
    }
  } as Record<BloodType, BloodCompatibility>,

  // Platelets - ABO compatibility preferred but not strict
  platelets: BLOOD_COMPATIBILITY,

  // Whole Blood
  whole_blood: BLOOD_COMPATIBILITY
};

// Donation Eligibility Constants
export const DONATION_ELIGIBILITY = {
  MIN_AGE: 18,
  MAX_AGE: 65,
  MIN_WEIGHT: 45, // kg
  MIN_HEMOGLOBIN_MALE: 13.5, // g/dL
  MIN_HEMOGLOBIN_FEMALE: 12.5, // g/dL
  MIN_RECOVERY_DAYS: 56, // days between whole blood donations
  MIN_RECOVERY_DAYS_PLASMA: 28, // days between plasma donations
  MIN_RECOVERY_DAYS_PLATELETS: 7, // days between platelet donations
  MAX_DONATIONS_PER_YEAR: 6,
  MIN_PULSE: 50,
  MAX_PULSE: 100,
  MIN_SYSTOLIC_BP: 90,
  MAX_SYSTOLIC_BP: 180,
  MIN_DIASTOLIC_BP: 50,
  MAX_DIASTOLIC_BP: 100
};

// Blood Storage Constants
export const BLOOD_STORAGE = {
  WHOLE_BLOOD_SHELF_LIFE: 35, // days
  RED_CELLS_SHELF_LIFE: 42, // days
  PLASMA_SHELF_LIFE: 365, // days (frozen)
  PLATELETS_SHELF_LIFE: 5, // days
  STORAGE_TEMP_WHOLE_BLOOD: '1-6°C',
  STORAGE_TEMP_PLASMA: '-18°C or below',
  STORAGE_TEMP_PLATELETS: '20-24°C'
};

// Urgency Levels
export const URGENCY_LEVELS = [
  { value: 'low', label: 'Thấp', color: 'bg-green-500', description: 'Có thể chờ 3-7 ngày' },
  { value: 'medium', label: 'Trung bình', color: 'bg-yellow-500', description: 'Cần trong 1-3 ngày' },
  { value: 'high', label: 'Cao', color: 'bg-orange-500', description: 'Cần trong 24 giờ' },
  { value: 'critical', label: 'Khẩn cấp', color: 'bg-red-500', description: 'Cần ngay lập tức' }
];

// Blood Type Colors for UI
export const BLOOD_TYPE_COLORS: Record<BloodType, string> = {
  'O-': 'bg-red-600 text-white',
  'O+': 'bg-red-500 text-white',
  'A-': 'bg-blue-600 text-white',
  'A+': 'bg-blue-500 text-white',
  'B-': 'bg-green-600 text-white',
  'B+': 'bg-green-500 text-white',
  'AB-': 'bg-purple-600 text-white',
  'AB+': 'bg-purple-500 text-white'
};

// Vietnamese Translations
export const TRANSLATIONS = {
  bloodTypes: {
    'A+': 'A dương tính',
    'A-': 'A âm tính',
    'B+': 'B dương tính',
    'B-': 'B âm tính',
    'AB+': 'AB dương tính',
    'AB-': 'AB âm tính',
    'O+': 'O dương tính',
    'O-': 'O âm tính'
  },
  components: {
    'whole_blood': 'Máu toàn phần',
    'red_blood_cells': 'Hồng cầu',
    'plasma': 'Huyết tương',
    'platelets': 'Tiểu cầu'
  },
  urgency: {
    'low': 'Thấp',
    'medium': 'Trung bình',
    'high': 'Cao',
    'critical': 'Khẩn cấp'
  },
  status: {
    'pending': 'Chờ xử lý',
    'confirmed': 'Đã xác nhận',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
    'expired': 'Hết hạn'
  }
};

// Medical Conditions that may affect donation eligibility
export const MEDICAL_CONDITIONS = [
  'Tiểu đường',
  'Tăng huyết áp',
  'Bệnh tim',
  'Hen suyễn',
  'Dị ứng',
  'Viêm gan B',
  'Viêm gan C',
  'HIV',
  'Ung thư',
  'Rối loạn đông máu',
  'Thiếu máu',
  'Bệnh tự miễn',
  'Khác'
];

// Time slots for appointments
export const TIME_SLOTS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30'
];

// Vietnamese provinces
export const PROVINCES = [
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
  'Phú Yên',
  'Cần Thơ',
  'Đà Nẵng',
  'Hải Phòng',
  'Hà Nội',
  'TP Hồ Chí Minh'
];

// Default medical facility info
export const DEFAULT_FACILITY = {
  name: 'Bệnh viện Đa khoa Trung ương',
  address: {
    street: '123 Đường Lê Duẩn',
    city: 'Hồ Chí Minh',
    district: 'Hoàn Kiếm',
    province: 'Hồ Chí Minh',
    postalCode: '100000'
  },
  phone: '024-3975-1234',
  email: 'info@hospital.gov.vn'
};
