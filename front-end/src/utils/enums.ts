// User Role Enum
export enum UserRole {
    MEMBER = 'member',
    USER = 'user',
    STAFF = 'staff',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
}

// Blood Type ABO Enum
export enum BloodTypeABO {
    A = 'A',
    B = 'B',
    AB = 'AB',
    O = 'O'
}

// Blood Type Rh Enum
export enum BloodTypeRh {
    POSITIVE = '+',
    NEGATIVE = '-'
}

// Blood Component Type Enum
export enum BloodComponentType {
    WHOLE_BLOOD = 'whole_blood',
    RED_CELLS = 'red_cells',
    PLASMA = 'plasma',
    PLATELETS = 'platelets',
    CRYOPRECIPITATE = 'cryoprecipitate',
    FRESH_FROZEN_PLASMA = 'fresh_frozen_plasma'
}

// Donation Status Enum
export enum DonationStatus {
    SCHEDULED = 'scheduled',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
    DEFERRED = 'deferred'
}

// Blood Unit Status Enum
export enum BloodUnitStatus {
    AVAILABLE = 'available',
    RESERVED = 'reserved',
    ALLOCATED = 'allocated',
    USED = 'used',
    EXPIRED = 'expired',
    QUARANTINED = 'quarantined',
    DISCARDED = 'discarded'
}

// Request Status Enum
export enum RequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    IN_PROGRESS = 'in_progress',
    MATCHED = 'matched',
    FULFILLED = 'fulfilled',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired'
}

// Request Priority Enum
export enum RequestPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
    EMERGENCY = 'emergency'
}

// Request Urgency Enum
export enum RequestUrgency {
    ROUTINE = 'routine',
    URGENT = 'urgent',
    STAT = 'stat',
    EMERGENCY = 'emergency'
}

// Appointment Status Enum
export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    CONFIRMED = 'confirmed',
    CHECKED_IN = 'checked_in',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
    RESCHEDULED = 'rescheduled'
}

// Health Check Status Enum
export enum HealthCheckStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    PASSED = 'passed',
    FAILED = 'failed',
    DEFERRED = 'deferred'
}

// Test Result Status Enum
export enum TestResultStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    POSITIVE = 'positive',
    NEGATIVE = 'negative',
    INCONCLUSIVE = 'inconclusive'
}

// Notification Type Enum
export enum NotificationType {
    APPOINTMENT_REMINDER = 'appointment_reminder',
    ELIGIBILITY_RESTORED = 'eligibility_restored',
    URGENT_REQUEST = 'urgent_request',
    ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
    DONATION_THANK_YOU = 'donation_thank_you',
    SYSTEM_ALERT = 'system_alert',
    INVENTORY_ALERT = 'inventory_alert',
    MAINTENANCE = 'maintenance'
}

// Notification Priority Enum
export enum NotificationPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

// Gender Enum
export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
    PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

// Marital Status Enum
export enum MaritalStatus {
    SINGLE = 'single',
    MARRIED = 'married',
    DIVORCED = 'divorced',
    WIDOWED = 'widowed',
    SEPARATED = 'separated'
}

// Education Level Enum
export enum EducationLevel {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    HIGH_SCHOOL = 'high_school',
    VOCATIONAL = 'vocational',
    BACHELOR = 'bachelor',
    MASTER = 'master',
    DOCTORATE = 'doctorate'
}

// Employment Status Enum
export enum EmploymentStatus {
    EMPLOYED = 'employed',
    UNEMPLOYED = 'unemployed',
    STUDENT = 'student',
    RETIRED = 'retired',
    SELF_EMPLOYED = 'self_employed'
}

// Hospital Type Enum
export enum HospitalType {
    PUBLIC = 'public',
    PRIVATE = 'private',
    MILITARY = 'military',
    UNIVERSITY = 'university',
    SPECIALIZED = 'specialized'
}

// Hospital Status Enum
export enum HospitalStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    MAINTENANCE = 'maintenance',
    SUSPENDED = 'suspended'
}

// Staff Position Enum
export enum StaffPosition {
    NURSE = 'nurse',
    DOCTOR = 'doctor',
    TECHNICIAN = 'technician',
    COORDINATOR = 'coordinator',
    MANAGER = 'manager',
    ADMINISTRATOR = 'administrator'
}

// Work Shift Enum
export enum WorkShift {
    MORNING = 'morning',
    AFTERNOON = 'afternoon',
    EVENING = 'evening',
    NIGHT = 'night',
    FULL_DAY = 'full_day'
}

// Achievement Type Enum
export enum AchievementType {
    DONATION_COUNT = 'donation_count',
    VOLUME_DONATED = 'volume_donated',
    CONSECUTIVE_DONATIONS = 'consecutive_donations',
    REFERRALS = 'referrals',
    COMMUNITY_SERVICE = 'community_service',
    SPECIAL_EVENT = 'special_event'
}

// Achievement Rarity Enum
export enum AchievementRarity {
    COMMON = 'common',
    UNCOMMON = 'uncommon',
    RARE = 'rare',
    EPIC = 'epic',
    LEGENDARY = 'legendary'
}

// Blog Post Status Enum
export enum BlogPostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
    DELETED = 'deleted'
}

// Blog Category Enum
export enum BlogCategory {
    HEALTH = 'health',
    DONATION_TIPS = 'donation_tips',
    SUCCESS_STORIES = 'success_stories',
    MEDICAL_NEWS = 'medical_news',
    COMMUNITY = 'community',
    RESEARCH = 'research'
}

// System Status Enum
export enum SystemStatus {
    OPERATIONAL = 'operational',
    MAINTENANCE = 'maintenance',
    DEGRADED = 'degraded',
    OUTAGE = 'outage'
}

// Audit Action Enum
export enum AuditAction {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    LOGIN = 'login',
    LOGOUT = 'logout',
    EXPORT = 'export',
    IMPORT = 'import'
}

// Report Type Enum
export enum ReportType {
    DONATION_SUMMARY = 'donation_summary',
    INVENTORY_STATUS = 'inventory_status',
    USER_ACTIVITY = 'user_activity',
    FINANCIAL = 'financial',
    COMPLIANCE = 'compliance',
    PERFORMANCE = 'performance'
}

// Report Format Enum
export enum ReportFormat {
    PDF = 'pdf',
    EXCEL = 'excel',
    CSV = 'csv',
    JSON = 'json'
}

// Payment Status Enum
export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded'
}

// Communication Channel Enum
export enum CommunicationChannel {
    EMAIL = 'email',
    SMS = 'sms',
    PUSH_NOTIFICATION = 'push_notification',
    IN_APP = 'in_app',
    PHONE_CALL = 'phone_call'
}

// Frequency Enum
export enum Frequency {
    ONCE = 'once',
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly'
}

// Time Zone Enum (Vietnam specific)
export enum TimeZone {
    ICT = 'Asia/Ho_Chi_Minh' // Indochina Time
}

// Language Enum
export enum Language {
    VIETNAMESE = 'vi',
    ENGLISH = 'en'
}

// Theme Enum
export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
    SYSTEM = 'system'
}

// Sort Order Enum
export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc'
}

// File Type Enum
export enum FileType {
    IMAGE = 'image',
    DOCUMENT = 'document',
    VIDEO = 'video',
    AUDIO = 'audio',
    OTHER = 'other'
}

// HTTP Status Code Enum
export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}