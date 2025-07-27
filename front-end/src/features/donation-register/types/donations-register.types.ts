// Định nghĩa type cho các API donation-register

export interface DonationRegistrationDTO {
  registrationId: string;
  eventId: string; // lấy từ event.eventId
  accountId: string; // lấy từ account.accountId
  dateCreated: string; // ISO date string
  status: string;
  healthCheckId: string;
  donorFeedbackId: string;
  donationDate: string; // thêm donationDate
}

export interface DonationRegistration {
  registrationId: string;
  dateCreated: string; // ISO date string
  status: string;
  healthCheckId: string;
  donorFeedbackId: string;
  donationDate: string; // thêm donationDate
  event: { eventId: string; nameOfEvent?: string };
  account: { accountId: string; username?: string };
}

export interface DonationCreatePayload {
  eventId?: string | null; // có thể không truyền nếu không có sự kiện
  accountId: string | null; // truyền vào khi tạo mới
  status: string;
  donationDate: string; // ISO datetime string
  registrationId: string | null;
  dateCreated: string; // ISO date string
  healthCheckId: string | null;
  donorFeedbackId: string | null;
}

export interface DonationUpdatePayload {
  status?: string;
  donationDate?: string;
  componentId: string 
  healthCheckId: string// thêm donationDate
}

export interface DonationFilterParams {
  eventId?: string;
}
