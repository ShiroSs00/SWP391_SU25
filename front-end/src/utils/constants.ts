// Application Constants
export const APP_CONFIG = {
    NAME: 'BloodConnect',
    VERSION: '1.0.0',
    DESCRIPTION: 'Hệ thống quản lý hiến máu',
    CONTACT_EMAIL: 'info@bloodconnect.vn',
    CONTACT_PHONE: '+84 123 456 789',
    ADDRESS: '123 Đường ABC, Quận 1, TP.HCM'
} as const;

// Blood Type Constants
export const BLOOD_TYPES = {
    ABO: ['A', 'B', 'AB', 'O'] as const,
    RH: ['+', '-'] as const,
    ALL: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const
} as const;

// Blood Component Constants
export const BLOOD_COMPONENTS = {
    WHOLE_BLOOD: 'whole_blood',
    RED_CELLS: 'red_cells',
    PLASMA: 'plasma',
    PLATELETS: 'platelets',
    CRYOPRECIPITATE: 'cryoprecipitate',
    FRESH_FROZEN_PLASMA: 'fresh_frozen_plasma'
} as const;

// Donation Constants
export const DONATION_CONFIG = {
    MIN_AGE: 18,
    MAX_AGE: 65,
    MIN_WEIGHT: 45, // kg
    MIN_HEMOGLOBIN_MALE: 13.0, // g/dL
    MIN_HEMOGLOBIN_FEMALE: 12.5, // g/dL
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
        PLATELETS: 24
    }
} as const;

// Request Priority Constants
export const REQUEST_PRIORITY = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    CRITICAL: 4,
    EMERGENCY: 5
} as const;

// Inventory Thresholds
export const INVENTORY_THRESHOLDS = {
    CRITICAL: 5,
    LOW: 10,
    NORMAL: 20,
    HIGH: 50
} as const;

// Time Constants
export const TIME_CONSTANTS = {
    BLOOD_SHELF_LIFE: {
        WHOLE_BLOOD: 35, // days
        RED_CELLS: 42, // days
        PLASMA: 365, // days
        PLATELETS: 5, // days
        CRYOPRECIPITATE: 365 // days
    },
    APPOINTMENT_SLOTS: [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30'
    ],
    WORKING_HOURS: {
        START: '08:00',
        END: '17:00',
        LUNCH_START: '12:00',
        LUNCH_END: '13:00'
    }
} as const;

// API Configuration Constants
export const API_CONFIG = {
    BASE_URL: 'http://localhost:5173/api', // Default base URL for API requests
    TIMEOUT: 30000, // Request timeout in milliseconds
    RETRY_ATTEMPTS: 3, // Number of retry attempts for failed requests
    ENDPOINTS: {
        AUTH: '/auth', // Authentication-related endpoints
        USERS: '/users', // User management endpoints
        DONATIONS: '/donations', // Blood donation-related endpoints
        REQUESTS: '/requests', // Blood request-related endpoints
        INVENTORY: '/inventory', // Blood inventory-related endpoints
        HOSPITALS: '/hospitals', // Hospital-related endpoints
        NOTIFICATIONS: '/notifications', // Notification-related endpoints
        BLOG: '/blog', // Blog-related endpoints
        REPORTS: '/reports' // Reporting-related endpoints
    }
} as const;

// Pagination Constants
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
    MAX_PAGE_SIZE: 100
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: {
        IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }
} as const;

// Notification Constants
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'bloodconnect_auth_token',
    REFRESH_TOKEN: 'bloodconnect_refresh_token',
    USER_PROFILE: 'bloodconnect_user_profile',
    PREFERENCES: 'bloodconnect_preferences',
    CART: 'bloodconnect_cart',
    RECENT_SEARCHES: 'bloodconnect_recent_searches'
} as const;

// Achievement Constants
export const ACHIEVEMENTS = {
    FIRST_DONATION: 'first_donation',
    REGULAR_DONOR: 'regular_donor',
    HERO_DONOR: 'hero_donor',
    LIFESAVER: 'lifesaver',
    CHAMPION: 'champion',
    LEGEND: 'legend'
} as const;

// Points System
export const POINTS_SYSTEM = {
    DONATION: 100,
    REFERRAL: 50,
    PROFILE_COMPLETE: 25,
    HEALTH_CHECK: 10,
    FEEDBACK: 5,
    MULTIPLIERS: {
        EMERGENCY: 2,
        RARE_BLOOD: 1.5,
        FIRST_TIME: 1.2
    }
} as const;

// Geographic Constants: Districts and Wards of Ho Chi Minh City
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
    TIMEOUT_ERROR: 'Hết thời gian chờ. Vui lòng thử lại.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    DONATION_REGISTERED: 'Đăng ký hiến máu thành công!',
    PROFILE_UPDATED: 'Cập nhật hồ sơ thành công!',
    REQUEST_SUBMITTED: 'Gửi yêu cầu thành công!',
    APPOINTMENT_SCHEDULED: 'Đặt lịch hẹn thành công!',
    PASSWORD_CHANGED: 'Đổi mật khẩu thành công!'
} as const;