export interface AdminEvent {
  nameOfEvent: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  expectedBloodVolume: number;
  actualVolume: number;
  location: string;
  status: string;
  eventId: string;
  accountId: string;
  creationDate: string; // ISO date string
}
