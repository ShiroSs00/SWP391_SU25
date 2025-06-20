export interface DonationHistoryItem {
  id: string;
  donorId: string;
  donationDate: Date;
  bloodType: BloodType;
  component: BloodComponent;
  unitsCollected: number;
  hospitalId: string;
  hospitalName: string;
  staffId: string;
  staffName: string;
  preCheckId: string;
  postCheckId?: string;
  status: DonationStatus;
  notes?: string;
  nextEligibleDate: Date;
  location: {
    name: string;
    address: string;
  };
  healthMetrics: {
    weight: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    heartRate: number;
    hemoglobin: number;
  };
}

export type DonationStatus = 'completed' | 'incomplete' | 'adverse_reaction' | 'cancelled';

export interface DonationStats {
  totalDonations: number;
  totalUnits: number;
  lifeSaved: number;
  streakDays: number;
  lastDonationDate?: Date;
  nextEligibleDate?: Date;
  favoriteLocation?: string;
  achievements: {
    milestones: number[];
    badges: string[];
  };
  yearlyStats: {
    year: number;
    donations: number;
    units: number;
  }[];
  componentBreakdown: {
    [key in BloodComponent]: number;
  };
}

export interface DonationCalendar {
  date: Date;
  isEligible: boolean;
  isDonationDate: boolean;
  isNextEligible: boolean;
  donations: DonationHistoryItem[];
}

export interface HistoryFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  bloodType?: BloodType;
  component?: BloodComponent;
  status?: DonationStatus;
  hospital?: string;
  sortBy?: 'date' | 'hospital' | 'component';
  sortOrder?: 'asc' | 'desc';
}

import { BloodType, BloodComponent } from '../../../types';