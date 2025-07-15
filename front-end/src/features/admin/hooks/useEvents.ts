import api from '../../../services/axios/api';
import type { AdminEvent } from '../types/admin.types';

// Lấy tất cả event
export const getAllEvents = async (): Promise<AdminEvent[]> => {
  const res = await api.get<AdminEvent[]>('/event/getall');
  return res.data.data;
};

// Tạo mới event
export const createEvent = async (event: {
  nameOfEvent: string;
  startDate?: string; // Made optional
  endDate?: string;   // Made optional
  expectedBloodVolume?: number; // Made optional
  location: string;
  status: string;
  accountId: string;
}): Promise<{
  eventId: string;
  nameOfEvent: string;
  creationDate: string;
  startDate?: string; // Made optional
  endDate?: string;   // Made optional
  expectedBloodVolume?: number; // Made optional
  location: string;
  status: string;
  accountId: string;
}> => {
  const res = await api.post('/event/create', event);
  return res.data;
};

// Cập nhật event
export const updateEvent = async (
  id: string,
  event: {
    nameOfEvent?: string;
    startDate?: string;
    endDate?: string;
    expectedBloodVolume?: number;
    location?: string;
    status?: string;
    accountId?: string;
  }
): Promise<{
  eventId: string;
  nameOfEvent: string;
  creationDate: string;
  startDate: string;
  endDate: string;
  expectedBloodVolume: number;
  location: string;
  status: string;
  accountId: string;
}> => {
  const res = await api.put(`/event/update/${id}`, event);
  return res.data;
};

// Xóa event
export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/event/delete/${id}`);
};

// Xóa nhiều sự kiện
export const deleteMultipleEvents = async (ids: string[]): Promise<void> => {
  await api.delete(`/event/delete-multiple`, {
    data: ids,
  });
};

// Lọc event theo ngày kết thúc
export const filterEventsByEndDateRange = async (from: string, to: string): Promise<AdminEvent[]> => {
  const res = await api.get<AdminEvent[]>(`/event/by-end-date-range?from=${from}&to=${to}`);
  return res.data;
};
