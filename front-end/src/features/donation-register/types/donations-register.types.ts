// Định nghĩa type cho các API donation-register (chỉ các trường liên quan accountId, eventId)

export interface DonationRegistrationDTO {
  registrationId: string;
  eventId: string; // lấy từ event.eventId
  accountId: string; // lấy từ account.accountId
  dateCreated: string; // ISO date string
  status: string;
}

export interface DonationRegistration {
  registrationId: string;
  dateCreated: string; // ISO date string
  status: string;
  event: { eventId: string; nameOfEvent?: string };
  account: { accountId: string; username?: string };
}

export interface DonationCreatePayload {
  eventId: string; // truyền vào khi tạo mới
  accountId: string; // truyền vào khi tạo mới
  status: string;
}

export interface DonationUpdatePayload {
  status?: string;
}

export interface DonationFilterParams {
  username?: string;
  eventId?: string;
}
