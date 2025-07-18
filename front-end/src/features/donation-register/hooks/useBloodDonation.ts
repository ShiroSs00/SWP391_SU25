import api from '../../../services/axios/api';
import type {
  DonationRegistrationDTO,
  DonationRegistration,
  DonationCreatePayload,
  DonationUpdatePayload,
  DonationFilterParams
} from '../types/donations-register.types';

// Lấy tất cả đăng ký hiến máu
export const getAllDonations = async (): Promise<DonationRegistrationDTO[]> => {
  const res = await api.get<DonationRegistrationDTO[]>('/donation/getall');
  return res.data;
};

// Lấy đăng ký theo username
export const getDonationsByUsername = async (username: string): Promise<DonationRegistrationDTO[]> => {
  const res = await api.get<DonationRegistrationDTO[]>(`/donation/get-by-username/${username}`);
  return res.data;
};

// Lấy đăng ký theo id
export const getDonationById = async (id: string): Promise<DonationRegistration> => {
  const res = await api.get<DonationRegistration>(`/donation/get-by-id/${id}`);
  return res.data;
};

// Lấy đăng ký theo event
export const getDonationsByEvent = async (eventId: string): Promise<DonationRegistrationDTO[]> => {
  const res = await api.get<DonationRegistrationDTO[]>(`/donation/get-by-event/${eventId}`);
  return res.data;
};

// Lọc đăng ký hiến máu
export const filterDonations = async (params: DonationFilterParams): Promise<DonationRegistrationDTO[]> => {
  const res = await api.get<DonationRegistrationDTO[]>('/donation/filter', { params });
  return res.data;
};

// Tạo mới đăng ký hiến máu
export const createDonation = async (token: string, eventId: string | null, payload: Partial<DonationCreatePayload>): Promise<void> => {
  const endpoint = eventId ? `/donation/create/${eventId}` : '/donation/create';
  const res = await api.post(endpoint, {
    donationDate: payload.donationDate,
    eventId: eventId || '', // Use default event ID if none is provided
  }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
  }});
  return res.data;
};

// Cập nhật đăng ký hiến máu
export const updateDonation = async (id: string, data: DonationUpdatePayload): Promise<DonationRegistrationDTO> => {
  const res = await api.put<DonationRegistrationDTO>(`/donation/update/${id}`, data);
  return res.data;
};

// Xóa đăng ký hiến máu
export const deleteDonation = async (id: string): Promise<void> => {
  await api.delete(`/donation/delete/${id}`);
};

// Xóa nhiều đăng ký hiến máu
export const deleteMultipleDonations = async (ids: string[]): Promise<void> => {
  await api.delete('/donation/delete-multiple', { data: ids });
};
