// Application Constants
export const APP_CONFIG = {
    NAME: 'BloodConnect',
    VERSION: '2.0.0',
    DESCRIPTION: 'Hệ thống quản lý hiến máu thông minh',
    CONTACT_EMAIL: 'info@bloodconnect.vn',
    CONTACT_PHONE: '+84 123 456 789',
    EMERGENCY_HOTLINE: '115',
    ADDRESS: '123 Đường ABC, Quận 1, TP.HCM',
    WEBSITE: 'https://bloodconnect.vn',
    SUPPORT_EMAIL: 'support@bloodconnect.vn'
} as const;

// Blood Type Constants
export const BLOOD_TYPES = {
    ABO: ['A', 'B', 'AB', 'O'] as const,
    RH: ['+', '-'] as const,
    ALL: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const,
    UNIVERSAL_DONOR: 'O-',
    UNIVERSAL_RECIPIENT: 'AB+',
    RARE_TYPES: ['AB-', 'B-', 'A-', 'O-'] as const
} as const;

// Blood Component Constants
export const BLOOD_COMPONENTS = {
    WHOLE_BLOOD: 'whole_blood',
    RED_CELLS: 'red_cells',
    PLASMA: 'plasma',
    PLATELETS: 'platelets',
    CRYOPRECIPITATE: 'cryoprecipitate',
    FRESH_FROZEN_PLASMA: 'fresh_frozen_plasma',
    PACKED_RED_CELLS: 'packed_red_cells',
    PLATELET_CONCENTRATE: 'platelet_concentrate',
    GRANULOCYTES: 'granulocytes'
} as const;

// Donation Configuration
export const DONATION_CONFIG = {
    MIN_AGE: 18,
    MAX_AGE: 65,
    MIN_WEIGHT: 50, // kg
    MIN_HEMOGLOBIN_MALE: 13.0, // g/dL
    MIN_HEMOGLOBIN_FEMALE: 12.0, // g/dL
    DONATION_VOLUME: 450, // ml
    INTERVALS: {
        WHOLE_BLOOD: 56, // days
        PLASMA: 28, // days
        PLATELETS: 7, // days
        DOUBLE_RED_CELLS: 112 // days
    },
    MAX_DONATIONS_PER_YEAR: {
        WHOLE_BLOOD: 6,
        PLASMA: 24,
        PLATELETS: 24,
        DOUBLE_RED_CELLS: 3
    },
    VITAL_SIGNS: {
        MIN_BLOOD_PRESSURE: { systolic: 90, diastolic: 50 },
        MAX_BLOOD_PRESSURE: { systolic: 180, diastolic: 100 },
        MIN_HEART_RATE: 50,
        MAX_HEART_RATE: 100,
        MIN_TEMPERATURE: 36.1,
        MAX_TEMPERATURE: 37.5
    }
} as const;

// Request Priority Levels
export const REQUEST_PRIORITY = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    CRITICAL: 4,
    EMERGENCY: 5
} as const;

// Inventory Thresholds
export const INVENTORY_THRESHOLDS = {
    CRITICAL: 10,
    LOW: 25,
    NORMAL: 50,
    HIGH: 100,
    EXCESS: 200
} as const;

// Time Constants
export const TIME_CONSTANTS = {
    BLOOD_SHELF_LIFE: {
        WHOLE_BLOOD: 35, // days
        RED_CELLS: 42,
        PLASMA: 365,
        PLATELETS: 5,
        CRYOPRECIPITATE: 365,
        FRESH_FROZEN_PLASMA: 365
    },
    APPOINTMENT_SLOTS: [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00'
    ],
    WORKING_HOURS: {
        START: '08:00',
        END: '17:30',
        LUNCH_START: '12:00',
        LUNCH_END: '13:00'
    },
    EMERGENCY_RESPONSE_TIME: 30, // minutes
    NOTIFICATION_DELAY: 5000 // milliseconds
} as const;

// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    TIMEOUT: 30000, // milliseconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    ENDPOINTS: {
        AUTH: '/auth',
        USERS: '/users',
        DONATIONS: '/donations',
        INVENTORY: '/inventory',
        HOSPITALS: '/hospitals',
        REQUESTS: '/requests',
        NOTIFICATIONS: '/notifications',
        BLOG: '/blog',
        FEEDBACK: '/feedback',
        ACHIEVEMENTS: '/achievements',
        POINTS: '/points',
        STAFF: '/staff',
        ADMIN: '/admin',
        HEALTH_CHECKS: '/health-checks',
        BLOOD_TYPES: '/blood-types',
        MATCHING: '/matching',
        REPORTS: '/reports',
        ANALYTICS: '/analytics'
    }
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    MAX_PAGE_SIZE: 100
} as const;

// File Upload
export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    APPOINTMENT_REMINDER: 'appointment_reminder',
    ELIGIBILITY_RESTORED: 'eligibility_restored',
    URGENT_REQUEST: 'urgent_request',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
    DONATION_THANK_YOU: 'donation_thank_you',
    SYSTEM_ALERT: 'system_alert',
    INVENTORY_ALERT: 'inventory_alert',
    MAINTENANCE: 'maintenance'
} as const;

// Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'bloodconnect_auth_token',
    REFRESH_TOKEN: 'bloodconnect_refresh_token',
    USER_DATA: 'bloodconnect_user_data',
    PREFERENCES: 'bloodconnect_preferences',
    THEME: 'bloodconnect_theme',
    LANGUAGE: 'bloodconnect_language',
    LAST_VISIT: 'bloodconnect_last_visit',
    CART: 'bloodconnect_cart',
    SEARCH_HISTORY: 'bloodconnect_search_history'
} as const;

// Achievements
export const ACHIEVEMENTS = {
    FIRST_DONATION: 'first_donation',
    REGULAR_DONOR: 'regular_donor',
    LIFE_SAVER: 'life_saver',
    HERO: 'hero',
    CHAMPION: 'champion',
    LEGEND: 'legend',
    REFERRAL_MASTER: 'referral_master',
    COMMUNITY_BUILDER: 'community_builder',
    EMERGENCY_RESPONDER: 'emergency_responder',
    MILESTONE_5: 'milestone_5',
    MILESTONE_10: 'milestone_10',
    MILESTONE_25: 'milestone_25',
    MILESTONE_50: 'milestone_50',
    MILESTONE_100: 'milestone_100'
} as const;

// Points System
export const POINTS_SYSTEM = {
    DONATION: 100,
    REFERRAL: 50,
    SURVEY_COMPLETION: 25,
    PROFILE_COMPLETION: 30,
    FIRST_DONATION: 200,
    EMERGENCY_DONATION: 150,
    RARE_BLOOD_DONATION: 120,
    CONSECUTIVE_DONATIONS: 50,
    MULTIPLIERS: {
        RARE_BLOOD: 1.5,
        EMERGENCY: 2.0,
        FIRST_TIME: 2.0,
        CONSECUTIVE: 1.2
    }
} as const;

// Vietnam Provinces
export const VIETNAM_PROVINCES = [
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
    'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
    'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
    'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
    'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
    'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
    'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
    'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái', 'Hà Nội', 'TP Hồ Chí Minh',
    'Hải Phòng', 'Đà Nẵng', 'Cần Thơ'
] as const;

// HCM Districts (keeping existing structure)
export const HCM_DISTRICTS = [
    {
        name: 'Quận 1',
        wards: [
            'Bến Nghé', 'Bến Thành', 'Cầu Kho', 'Cầu Ông Lãnh', 'Cô Giang',
            'Đa Kao', 'Nguyễn Cư Trinh', 'Nguyễn Thái Bình', 'Phạm Ngũ Lão', 'Tân Định'
        ]
    },
    {
        name: 'Quận 3',
        wards: [
            '1', '2', '3', '4', '5', '9', '10', '11', '12', '13', '14'
        ]
    },
    {
        name: 'Quận 4',
        wards: [
            '1', '2', '3', '4', '6', '8', '9', '10', '13', '14', '15', '16', '18'
        ]
    },
    {
        name: 'Quận 5',
        wards: [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'
        ]
    },
    {
        name: 'Quận 6',
        wards: [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'
        ]
    },
    {
        name: 'Quận 7',
        wards: [
            'Tân Thuận Đông', 'Tân Thuận Tây', 'Tân Kiểng', 'Tân Hưng', 'Bình Thuận',
            'Phú Mỹ', 'Phú Thuận', 'Tân Phú', 'Bình Thuận'
        ]
    },
    {
        name: 'Quận 8',
        wards: [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'
        ]
    },
    {
        name: 'Quận 10',
        wards: [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'
        ]
    },
    {
        name: 'Quận 11',
        wards: [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'
        ]
    },
    {
        name: 'Quận 12',
        wards: [
            'An Phú Đông', 'Đông Hưng Thuận', 'Hiệp Thành', 'Tân Chánh Hiệp', 'Tân Hưng Thuận',
            'Tân Thới Hiệp', 'Tân Thới Nhất', 'Thạnh Lộc', 'Thạnh Xuân', 'Thới An', 'Trung Mỹ Tây'
        ]
    },
    {
        name: 'Quận Bình Tân',
        wards: [
            'An Lạc', 'An Lạc A', 'Bình Hưng Hòa', 'Bình Hưng Hòa A', 'Bình Hưng Hòa B',
            'Bình Trị Đông', 'Bình Trị Đông A', 'Bình Trị Đông B', 'Tân Tạo', 'Tân Tạo A'
        ]
    },
    {
        name: 'Quận Bình Thạnh',
        wards: [
            '1', '2', '3', '5', '6', '7', '11', '12', '13', '14', '15', '17', '19', '21', '22', '24', '25', '26', '27', '28'
        ]
    },
    {
        name: 'Quận Gò Vấp',
        wards: [
            '1', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'
        ]
    },
    {
        name: 'Quận Phú Nhuận',
        wards: [
            '1', '2', '3', '4', '5', '7', '8', '9', '10', '11', '13', '15', '17'
        ]
    },
    {
        name: 'Quận Tân Bình',
        wards: [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'
        ]
    },
    {
        name: 'Quận Tân Phú',
        wards: [
            'Hiệp Tân', 'Hòa Thạnh', 'Phú Thạnh', 'Phú Thọ Hòa', 'Phú Trung',
            'Sơn Kỳ', 'Tân Quý', 'Tân Sơn Nhì', 'Tân Thành', 'Tân Thới Hòa', 'Tây Thạnh'
        ]
    },
    {
        name: 'Quận Thủ Đức',
        wards: [
            'Bình Chiểu', 'Bình Thọ', 'Hiệp Bình Chánh', 'Hiệp Bình Phước', 'Linh Chiểu',
            'Linh Đông', 'Linh Tây', 'Linh Trung', 'Linh Xuân', 'Tam Bình', 'Tam Phú', 'Trường Thọ'
        ]
    },
    {
        name: 'Thành phố Thủ Đức',
        wards: [
            'An Khánh', 'An Lợi Đông', 'An Phú', 'Bình Chiểu', 'Bình Thọ', 'Cát Lái', 'Hiệp Bình Chánh', 'Hiệp Bình Phước',
            'Hiệp Phú', 'Linh Chiểu', 'Linh Đông', 'Linh Tây', 'Linh Trung', 'Linh Xuân', 'Long Bình', 'Long Phước',
            'Long Thạnh Mỹ', 'Long Trường', 'Phú Hữu', 'Phước Bình', 'Phước Long A', 'Phước Long B', 'Tam Bình',
            'Tam Phú', 'Tăng Nhơn Phú A', 'Tăng Nhơn Phú B', 'Thảo Điền', 'Thạnh Mỹ Lợi', 'Thủ Thiêm', 'Trường Thạnh', 'Trường Thọ'
        ]
    },
    {
        name: 'Huyện Bình Chánh',
        wards: [
            'Bình Chánh', 'Bình Hưng', 'Bình Lợi', 'Đa Phước', 'Hưng Long', 'Lê Minh Xuân',
            'Phạm Văn Hai', 'Phong Phú', 'Quy Đức', 'Tân Kiên', 'Tân Nhựt', 'Tân Quý Tây', 'Vĩnh Lộc A', 'Vĩnh Lộc B'
        ]
    },
    {
        name: 'Huyện Cần Giờ',
        wards: [
            'An Thới Đông', 'Bình Khánh', 'Cần Thạnh', 'Long Hòa', 'Lý Nhơn', 'Tam Thôn Hiệp', 'Thạnh An'
        ]
    },
    {
        name: 'Huyện Củ Chi',
        wards: [
            'An Nhơn Tây', 'An Phú', 'Bình Mỹ', 'Củ Chi', 'Hòa Phú', 'Nhuận Đức', 'Phạm Văn Cội',
            'Phú Hòa Đông', 'Phú Mỹ Hưng', 'Phước Hiệp', 'Phước Thạnh', 'Phước Vĩnh An', 'Tân An Hội',
            'Tân Phú Trung', 'Tân Thạnh Đông', 'Tân Thạnh Tây', 'Tân Thông Hội', 'Thái Mỹ', 'Trung An', 'Trung Lập Hạ', 'Trung Lập Thượng'
        ]
    },
    {
        name: 'Huyện Hóc Môn',
        wards: [
            'Bà Điểm', 'Đông Thạnh', 'Hóc Môn', 'Nhị Bình', 'Tân Hiệp', 'Tân Thới Nhì', 'Tân Xuân',
            'Thới Tam Thôn', 'Trung Chánh', 'Xuân Thới Đông', 'Xuân Thới Sơn', 'Xuân Thới Thượng'
        ]
    },
    {
        name: 'Huyện Nhà Bè',
        wards: [
            'Hiệp Phước', 'Long Thới', 'Nhà Bè', 'Nhơn Đức', 'Phú Xuân', 'Phước Kiển', 'Phước Lộc'
        ]
    }
] as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
    UNAUTHORIZED: 'Bạn không có quyền truy cập.',
    FORBIDDEN: 'Truy cập bị từ chối.',
    NOT_FOUND: 'Không tìm thấy dữ liệu.',
    SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
    TIMEOUT_ERROR: 'Hết thời gian chờ. Vui lòng thử lại.',
    DUPLICATE_ERROR: 'Dữ liệu đã tồn tại.',
    INSUFFICIENT_PERMISSIONS: 'Không đủ quyền thực hiện thao tác này.',
    EXPIRED_TOKEN: 'Phiên đăng nhập đã hết hạn.',
    INVALID_CREDENTIALS: 'Thông tin đăng nhập không chính xác.',
    ACCOUNT_LOCKED: 'Tài khoản đã bị khóa.',
    EMAIL_NOT_VERIFIED: 'Email chưa được xác thực.',
    WEAK_PASSWORD: 'Mật khẩu không đủ mạnh.',
    FILE_TOO_LARGE: 'File quá lớn.',
    INVALID_FILE_TYPE: 'Loại file không được hỗ trợ.',
    QUOTA_EXCEEDED: 'Đã vượt quá giới hạn cho phép.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    DONATION_REGISTERED: 'Đăng ký hiến máu thành công!',
    PROFILE_UPDATED: 'Cập nhật hồ sơ thành công!',
    REQUEST_SUBMITTED: 'Gửi yêu cầu thành công!',
    APPOINTMENT_SCHEDULED: 'Đặt lịch hẹn thành công!',
    PASSWORD_CHANGED: 'Đổi mật khẩu thành công!',
    EMAIL_VERIFIED: 'Xác thực email thành công!',
    ACCOUNT_CREATED: 'Tạo tài khoản thành công!',
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    LOGOUT_SUCCESS: 'Đăng xuất thành công!',
    DATA_SAVED: 'Lưu dữ liệu thành công!',
    DATA_DELETED: 'Xóa dữ liệu thành công!',
    FEEDBACK_SUBMITTED: 'Gửi phản hồi thành công!',
    NOTIFICATION_SENT: 'Gửi thông báo thành công!',
    BACKUP_CREATED: 'Tạo bản sao lưu thành công!',
    SETTINGS_UPDATED: 'Cập nhật cài đặt thành công!'
} as const;

// Medical Conditions
export const MEDICAL_CONDITIONS = {
    DISQUALIFYING: [
        'hiv', 'hepatitis_b', 'hepatitis_c', 'syphilis', 'malaria',
        'chagas_disease', 'babesiosis', 'leishmaniasis', 'trypanosomiasis',
        'creutzfeldt_jakob_disease', 'variant_creutzfeldt_jakob_disease'
    ],
    TEMPORARY_DEFERRAL: [
        'cold', 'flu', 'fever', 'dental_work', 'vaccination',
        'antibiotic_treatment', 'pregnancy', 'breastfeeding',
        'recent_surgery', 'recent_tattoo', 'recent_piercing'
    ],
    CHRONIC_CONDITIONS: [
        'diabetes', 'hypertension', 'heart_disease', 'asthma',
        'epilepsy', 'cancer', 'autoimmune_disease', 'kidney_disease',
        'liver_disease', 'blood_disorder', 'mental_health_condition'
    ]
} as const;

// Medication Categories
export const MEDICATION_CATEGORIES = {
    BLOOD_THINNERS: ['warfarin', 'heparin', 'aspirin', 'clopidogrel'],
    ANTIBIOTICS: ['penicillin', 'amoxicillin', 'ciprofloxacin', 'azithromycin'],
    IMMUNOSUPPRESSANTS: ['methotrexate', 'cyclosporine', 'tacrolimus'],
    HORMONES: ['insulin', 'thyroid_hormone', 'birth_control'],
    PAIN_MEDICATIONS: ['ibuprofen', 'acetaminophen', 'morphine', 'codeine']
} as const;

// System Configuration
export const SYSTEM_CONFIG = {
    MAINTENANCE_MODE: false,
    FEATURE_FLAGS: {
        ENABLE_NOTIFICATIONS: true,
        ENABLE_ACHIEVEMENTS: true,
        ENABLE_POINTS_SYSTEM: true,
        ENABLE_BLOG: true,
        ENABLE_FEEDBACK: true,
        ENABLE_ANALYTICS: true,
        ENABLE_REAL_TIME: true,
        ENABLE_MOBILE_APP: false
    },
    CACHE_DURATION: {
        USER_DATA: 300000, // 5 minutes
        INVENTORY_DATA: 60000, // 1 minute
        STATIC_DATA: 3600000, // 1 hour
        SEARCH_RESULTS: 180000 // 3 minutes
    }
} as const;

// Export all constants
export default {
    APP_CONFIG,
    BLOOD_TYPES,
    BLOOD_COMPONENTS,
    DONATION_CONFIG,
    REQUEST_PRIORITY,
    INVENTORY_THRESHOLDS,
    TIME_CONSTANTS,
    API_CONFIG,
    PAGINATION,
    FILE_UPLOAD,
    NOTIFICATION_TYPES,
    STORAGE_KEYS,
    ACHIEVEMENTS,
    POINTS_SYSTEM,
    VIETNAM_PROVINCES,
    HCM_DISTRICTS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    MEDICAL_CONDITIONS,
    MEDICATION_CATEGORIES,
    SYSTEM_CONFIG
} as const;