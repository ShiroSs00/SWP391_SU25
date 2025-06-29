export enum UserRole {
  MEMBER = "MEMBER",
  USER = "USER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

export enum BloodType {
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
}

export enum DonationType {
  WHOLE_BLOOD = "whole_blood",
  PLASMA = "plasma",
  PLATELETS = "platelets",
  RED_CELLS = "red_cells",
}

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export enum DonationStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  DEFERRED = "deferred",
  CANCELLED = "cancelled",
}

export enum BloodUnitStatus {
  AVAILABLE = "available",
  RESERVED = "reserved",
  ISSUED = "issued",
  EXPIRED = "expired",
  TESTING = "testing",
  DISCARDED = "discarded",
}

export enum RequestPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
  EMERGENCY = "emergency",
}

export enum NotificationType {
  APPOINTMENT_REMINDER = "appointment_reminder",
  ELIGIBILITY_UPDATE = "eligibility_update",
  URGENT_REQUEST = "urgent_request",
  SYSTEM_ANNOUNCEMENT = "system_announcement",
  ACHIEVEMENT_UNLOCKED = "achievement_unlocked",
}
