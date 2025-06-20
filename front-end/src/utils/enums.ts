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
    FRESH_FROZEN_PLASMA = 'fresh_frozen_plasma',
    PACKED_RED_CELLS = 'packed_red_cells',
    PLATELET_CONCENTRATE = 'platelet_concentrate',
    GRANULOCYTES = 'granulocytes'
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
    COLLECTED = 'collected',
    TESTING = 'testing',
    PROCESSING = 'processing',
    AVAILABLE = 'available',
    RESERVED = 'reserved',
    ALLOCATED = 'allocated',
    ISSUED = 'issued',
    USED = 'used',
    EXPIRED = 'expired',
    QUARANTINED = 'quarantined',
    DISCARDED = 'discarded',
    RECALLED = 'recalled'
}

// Request Status Enum
export enum RequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    IN_PROGRESS = 'in_progress',
    MATCHED = 'matched',
    FULFILLED = 'fulfilled',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
    REJECTED = 'rejected'
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
    MAINTENANCE = 'maintenance',
    SECURITY_ALERT = 'security_alert',
    PROMOTIONAL = 'promotional'
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
    ADMINISTRATOR = 'administrator',
    RECEPTIONIST = 'receptionist',
    SECURITY = 'security',
    CLEANER = 'cleaner'
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
    SPECIAL_EVENT = 'special_event',
    EMERGENCY_RESPONSE = 'emergency_response',
    RARE_BLOOD_DONATION = 'rare_blood_donation'
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
    RESEARCH = 'research',
    EVENTS = 'events',
    EDUCATION = 'education'
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
    IMPORT = 'import',
    APPROVE = 'approve',
    REJECT = 'reject'
}

// Report Type Enum
export enum ReportType {
    DONATION_SUMMARY = 'donation_summary',
    INVENTORY_STATUS = 'inventory_status',
    USER_ACTIVITY = 'user_activity',
    FINANCIAL = 'financial',
    COMPLIANCE = 'compliance',
    PERFORMANCE = 'performance',
    ANALYTICS = 'analytics',
    AUDIT = 'audit'
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

// Inventory Alert Type Enum
export enum InventoryAlertType {
    LOW_STOCK = 'low_stock',
    CRITICAL_STOCK = 'critical_stock',
    EXPIRATION = 'expiration',
    TEMPERATURE = 'temperature',
    CONTAMINATION = 'contamination',
    EQUIPMENT_FAILURE = 'equipment_failure',
    QUALITY_ISSUE = 'quality_issue',
    RECALL = 'recall'
}

// Alert Severity Enum
export enum AlertSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

// Transaction Type Enum
export enum TransactionType {
    RECEIVED = 'received',
    ISSUED = 'issued',
    TRANSFERRED = 'transferred',
    DISCARDED = 'discarded',
    EXPIRED = 'expired',
    RETURNED = 'returned'
}

// Stock Status Enum
export enum StockStatus {
    ADEQUATE = 'adequate',
    LOW = 'low',
    CRITICAL = 'critical',
    EXCESS = 'excess'
}

// Feedback Category Enum
export enum FeedbackCategory {
    SERVICE_QUALITY = 'service_quality',
    STAFF_BEHAVIOR = 'staff_behavior',
    FACILITY_CLEANLINESS = 'facility_cleanliness',
    WAITING_TIME = 'waiting_time',
    OVERALL_EXPERIENCE = 'overall_experience',
    SUGGESTION = 'suggestion',
    COMPLAINT = 'complaint'
}

// Feedback Status Enum
export enum FeedbackStatus {
    PENDING = 'pending',
    REVIEWED = 'reviewed',
    RESPONDED = 'responded',
    RESOLVED = 'resolved'
}

// Survey Question Type Enum
export enum SurveyQuestionType {
    RATING = 'rating',
    MULTIPLE_CHOICE = 'multiple_choice',
    TEXT = 'text',
    YES_NO = 'yes_no',
    SCALE = 'scale'
}

// Smoking Status Enum
export enum SmokingStatus {
    NEVER = 'never',
    FORMER = 'former',
    CURRENT = 'current'
}

// Alcohol Consumption Enum
export enum AlcoholConsumption {
    NONE = 'none',
    OCCASIONAL = 'occasional',
    MODERATE = 'moderate',
    HEAVY = 'heavy'
}

// Eligibility Status Enum
export enum EligibilityStatus {
    ELIGIBLE = 'eligible',
    TEMPORARILY_DEFERRED = 'temporarily_deferred',
    PERMANENTLY_DEFERRED = 'permanently_deferred',
    UNDER_REVIEW = 'under_review'
}

// Deferral Reason Enum
export enum DeferralReason {
    LOW_HEMOGLOBIN = 'low_hemoglobin',
    HIGH_BLOOD_PRESSURE = 'high_blood_pressure',
    LOW_BLOOD_PRESSURE = 'low_blood_pressure',
    RECENT_ILLNESS = 'recent_illness',
    MEDICATION = 'medication',
    TRAVEL_HISTORY = 'travel_history',
    TATTOO_PIERCING = 'tattoo_piercing',
    PREGNANCY = 'pregnancy',
    BREASTFEEDING = 'breastfeeding',
    WEIGHT = 'weight',
    AGE = 'age',
    MEDICAL_CONDITION = 'medical_condition'
}

// Export all enums as a default object for convenience
export default {
    UserRole,
    BloodTypeABO,
    BloodTypeRh,
    BloodComponentType,
    DonationStatus,
    BloodUnitStatus,
    RequestStatus,
    RequestPriority,
    RequestUrgency,
    AppointmentStatus,
    HealthCheckStatus,
    TestResultStatus,
    NotificationType,
    NotificationPriority,
    Gender,
    MaritalStatus,
    EducationLevel,
    EmploymentStatus,
    HospitalType,
    HospitalStatus,
    StaffPosition,
    WorkShift,
    AchievementType,
    AchievementRarity,
    BlogPostStatus,
    BlogCategory,
    SystemStatus,
    AuditAction,
    ReportType,
    ReportFormat,
    PaymentStatus,
    CommunicationChannel,
    Frequency,
    TimeZone,
    Language,
    Theme,
    SortOrder,
    FileType,
    HttpStatusCode,
    InventoryAlertType,
    AlertSeverity,
    TransactionType,
    StockStatus,
    FeedbackCategory,
    FeedbackStatus,
    SurveyQuestionType,
    SmokingStatus,
    AlcoholConsumption,
    EligibilityStatus,
    DeferralReason
};