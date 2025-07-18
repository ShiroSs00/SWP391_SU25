export const UserRole = {
  MEMBER: "MEMBER",
  USER: "USER",
  STAFF: "STAFF",
  ADMIN: "ADMIN",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const BloodType = {
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
} as const;

export type BloodType = typeof BloodType[keyof typeof BloodType];

export const BloodTypeABO = {
  A: "A",
  B: "B",
  AB: "AB",
  O: "O",
} as const;

export type BloodTypeABO = typeof BloodTypeABO[keyof typeof BloodTypeABO];

export const BloodTypeRh = {
  POSITIVE: "+",
  NEGATIVE: "-",
} as const;

export type BloodTypeRh = typeof BloodTypeRh[keyof typeof BloodTypeRh];

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const BloodComponentType = {
  WHOLE_BLOOD: "WHOLE_BLOOD",
  PLASMA: "PLASMA",
  PLATELETS: "PLATELETS",
  RED_CELLS: "RED_CELLS",
} as const;

export type BloodComponentType = typeof BloodComponentType[keyof typeof BloodComponentType];

export const HealthCheckStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type HealthCheckStatus = typeof HealthCheckStatus[keyof typeof HealthCheckStatus];

export const RequestStatus = {
  PENDING: "PENDING",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  CANCELLED: "CANCELLED",
} as const;

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

export const FeedbackType = {
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  NEUTRAL: "NEUTRAL",
} as const;

export type FeedbackType = typeof FeedbackType[keyof typeof FeedbackType];

export const DonationType = {
  WHOLE_BLOOD: "whole_blood",
  PLASMA: "plasma",
  PLATELETS: "platelets",
  RED_CELLS: "red_cells",
} as const;

export type DonationType = typeof DonationType[keyof typeof DonationType];

export const AppointmentStatus = {
  SCHEDULED: "scheduled",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
} as const;

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus];

export const DonationStatus = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  DEFERRED: "deferred",
  CANCELLED: "cancelled",
} as const;

export type DonationStatus = typeof DonationStatus[keyof typeof DonationStatus];

export const BloodUnitStatus = {
  AVAILABLE: "available",
  RESERVED: "reserved",
  ISSUED: "issued",
  EXPIRED: "expired",
  TESTING: "testing",
  DISCARDED: "discarded",
} as const;

export type BloodUnitStatus = typeof BloodUnitStatus[keyof typeof BloodUnitStatus];

export const RequestPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
  EMERGENCY: "emergency",
} as const;

export type RequestPriority = typeof RequestPriority[keyof typeof RequestPriority];

export const NotificationType = {
  APPOINTMENT_REMINDER: "appointment_reminder",
  ELIGIBILITY_UPDATE: "eligibility_update",
  URGENT_REQUEST: "urgent_request",
  SYSTEM_ANNOUNCEMENT: "system_announcement",
  ACHIEVEMENT_UNLOCKED: "achievement_unlocked",
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];
