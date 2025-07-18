export interface AdminEvent {
  nameOfEvent: string;
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
  expectedBloodVolume?: number; // Made optional
  actualVolume?: number; // Made optional
  location: string;
  status: string;
  eventId: string;
  accountId: string;
  creationDate: string; // ISO date string
  expectedCost?: number; // Chi phí dự kiến
}

// Admin Roles
export const AdminRole = {
  MEMBER: 'MEMBER',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN'
} as const;

export type AdminRoleType = typeof AdminRole[keyof typeof AdminRole];
