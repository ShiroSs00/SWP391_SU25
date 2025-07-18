import api from '../../../services/axios/api';
import type { AdminEvent } from '../types/admin.types';

// Lấy tất cả event
export const getAllEvents = async (): Promise<AdminEvent[]> => {
  const res = await api.get<{ data: AdminEvent[] }>('/event/getall');
  return res.data.data;
};

// Tạo mới event
export const createEvent = async (event: {
  nameOfEvent: string;
  startDate?: string;
  endDate?: string;
  expectedBloodVolume?: number;
  location: string;
  expectedCost?: number;
}): Promise<{
  eventId: string;
  nameOfEvent: string;
  creationDate: string;
  startDate?: string;
  endDate?: string;
  expectedBloodVolume?: number;
  location: string;
  status: string;
  accountId: string;
  expectedCost?: number;
}> => {
  const res = await api.post<{ data: {
    eventId: string;
    nameOfEvent: string;
    creationDate: string;
    startDate?: string;
    endDate?: string;
    expectedBloodVolume?: number;
    location: string;
    status: string;
    accountId: string;
    expectedCost?: number;
  } }>('/event/create', event);
  return res.data.data;
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
    expectedCost?: number;
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
  expectedCost?: number;
}> => {
  const res = await api.put<{ data: {
    eventId: string;
    nameOfEvent: string;
    creationDate: string;
    startDate: string;
    endDate: string;
    expectedBloodVolume: number;
    location: string;
    status: string;
    accountId: string;
    expectedCost?: number;
  } }>(`/event/update/${id}`, event);
  return res.data.data;
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
  const res = await api.get<{ data: AdminEvent[] }>(`/event/by-end-date-range?from=${from}&to=${to}`);
  return res.data.data;
};
