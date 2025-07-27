// Định nghĩa type cho các API donation-register

// Định nghĩa các trạng thái có thể có của đơn hiến máu
export type DonationStatus = 'PENDING' | 'CHECKING' | 'COMPLETED' | 'CANCELLED';

export interface DonationRegistrationDTO {
  registrationId: string;
  eventId: string; // lấy từ event.eventId
  accountId: string; // lấy từ account.accountId
  dateCreated: string; // ISO date string
  status: DonationStatus;
  healthCheckId: string;
  donorFeedbackId: string;
  donationDate: string; // thêm donationDate
}

export interface DonationRegistration {
  registrationId: string;
  dateCreated: string; // ISO date string
  status: DonationStatus;
  healthCheckId: string;
  donorFeedbackId: string;
  donationDate: string; // thêm donationDate
  event: { eventId: string; nameOfEvent?: string };
  account: { accountId: string; username?: string };
}

export interface DonationCreatePayload {
  eventId?: string | null; // có thể không truyền nếu không có sự kiện
  accountId: string | null; // truyền vào khi tạo mới
  status: DonationStatus;
  donationDate: string; // ISO datetime string
  registrationId: string | null;
  dateCreated: string; // ISO date string
  healthCheckId: string | null;
  donorFeedbackId: string | null;
  volumeToTake: number; // thêm lượng máu hiến (ml)
}

export interface DonationUpdatePayload {
  status?: DonationStatus;
  donationDate?: string;
  componentId: string 
  healthCheckId: string// thêm donationDate
}

export interface DonationFilterParams {
  eventId?: string;
}
