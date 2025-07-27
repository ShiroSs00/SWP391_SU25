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
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}