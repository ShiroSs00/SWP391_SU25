export interface DonationRegistration {
  registrationId: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  eventId?: string;
  eventName?: string;
  registrationDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  donationDate?: string;
  bloodType?: string;
  notes?: string;
}

export interface DonationFilters {
  search?: string;
  eventId?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'all';
  startDate?: string;
  endDate?: string;
  bloodType?: string;
  sortBy?: 'registrationDate' | 'donationDate' | 'donorName';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DonationResponse {
  donations: DonationRegistration[];
  total: number;
  page: number;
  totalPages: number;
}