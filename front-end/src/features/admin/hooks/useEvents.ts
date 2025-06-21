import api from '../../../services/axios/api';
import type { AdminEvent } from '../types/admin.types';

// Lấy tất cả event
export const getAllEvents = async (): Promise<AdminEvent[]> => {
  const res = await api.get<AdminEvent[]>('/event/getall');
  return res.data;
};

// Tạo mới event
export const createEvent = async (event: Omit<AdminEvent, 'eventId' | 'creationDate'>): Promise<AdminEvent> => {
  const res = await api.post<AdminEvent>('/event/create', event);
  return res.data;
};

// Cập nhật event
export const updateEvent = async (id: string, event: Partial<AdminEvent>): Promise<AdminEvent> => {
  const res = await api.put<AdminEvent>(`/event/update/${id}`, event);
  return res.data;
};

// Xóa event
export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/event/delete/${id}`);
};

// Lọc event theo ngày
export const filterEventsByDate = async (start: string, end: string): Promise<AdminEvent[]> => {
  const res = await api.get<AdminEvent[]>(`/event/filter/by-date?start=${start}&end=${end}`);
  return res.data;
};
