import { 
  DonationFormData, 
  DonationRegistration, 
  EligibilityCheck, 
  DonationLocation, 
  TimeSlot 
} from '../types/donation.types';

export class DonationsService {
  private static instance: DonationsService;
  private baseUrl = '/api/donations';

  public static getInstance(): DonationsService {
    if (!DonationsService.instance) {
      DonationsService.instance = new DonationsService();
    }
    return DonationsService.instance;
  }

  async submitRegistration(data: DonationFormData): Promise<DonationRegistration> {
    try {
      // In a real app, this would be an HTTP request
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      return await response.json();
    } catch (error) {
      // Fallback to mock data for demo
      return this.mockSubmitRegistration(data);
    }
  }

  async checkEligibility(data: Partial<DonationFormData>): Promise<EligibilityCheck> {
    try {
      const response = await fetch(`${this.baseUrl}/eligibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Eligibility check failed');
      }

      return await response.json();
    } catch (error) {
      // Fallback to mock data for demo
      return this.mockCheckEligibility(data);
    }
  }

  async getAvailableLocations(): Promise<DonationLocation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/locations`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      return await response.json();
    } catch (error) {
      // Fallback to mock data for demo
      return this.mockGetLocations();
    }
  }

  async getAvailableTimeSlots(locationId: string, date: Date): Promise<TimeSlot[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/locations/${locationId}/timeslots?date=${date.toISOString().split('T')[0]}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch time slots');
      }

      return await response.json();
    } catch (error) {
      // Fallback to mock data for demo
      return this.mockGetTimeSlots();
    }
  }

  async getRegistration(id: string): Promise<DonationRegistration> {
    try {
      const response = await fetch(`${this.baseUrl}/registrations/${id}`);
      
      if (!response.ok) {
        throw new Error('Registration not found');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch registration');
    }
  }

  async updateRegistration(id: string, updates: Partial<DonationRegistration>): Promise<DonationRegistration> {
    try {
      const response = await fetch(`${this.baseUrl}/registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update registration');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to update registration');
    }
  }

  async cancelRegistration(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/registrations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel registration');
      }
    } catch (error) {
      throw new Error('Failed to cancel registration');
    }
  }

  // Mock methods for demo purposes
  private async mockSubmitRegistration(data: DonationFormData): Promise<DonationRegistration> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `REG-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      donorId: `DONOR-${Date.now()}`,
      donationType: data.donationType,
      scheduledDate: data.preferredDate || new Date(),
      scheduledTime: data.preferredTime || '09:00',
      location: {
        hospitalId: data.locationId || '1',
        hospitalName: 'Central Blood Donation Center',
        address: '123 Main Street, Ho Chi Minh City'
      },
      status: 'scheduled',
      eligibilityStatus: 'eligible',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private async mockCheckEligibility(data: Partial<DonationFormData>): Promise<EligibilityCheck> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simplified eligibility logic for demo
    const isEligible = !data.medicalHistory?.hasChronicIllness && 
                      (!data.weight || data.weight >= 50) &&
                      (!data.dateOfBirth || this.calculateAge(data.dateOfBirth) >= 18);

    return {
      isEligible,
      score: isEligible ? 95 : 45,
      reasons: isEligible ? [
        {
          type: 'info',
          severity: 'info',
          message: 'You appear eligible for blood donation!',
          disqualifying: false
        }
      ] : [
        {
          type: 'medical',
          severity: 'error',
          message: 'Please review eligibility criteria',
          disqualifying: true
        }
      ],
      recommendations: [
        'Eat a healthy meal before donation',
        'Drink plenty of water',
        'Get adequate rest',
        'Bring valid identification'
      ]
    };
  }

  private mockGetLocations(): DonationLocation[] {
    return [
      {
        id: '1',
        name: 'Central Blood Donation Center',
        address: '123 Main Street, Ho Chi Minh City',
        facilities: ['Air Conditioning', 'WiFi', 'Parking', 'Refreshments'],
        operatingHours: {
          monday: { open: '08:00', close: '17:00', isOpen: true },
          tuesday: { open: '08:00', close: '17:00', isOpen: true },
          wednesday: { open: '08:00', close: '17:00', isOpen: true },
          thursday: { open: '08:00', close: '17:00', isOpen: true },
          friday: { open: '08:00', close: '17:00', isOpen: true },
          saturday: { open: '08:00', close: '15:00', isOpen: true },
          sunday: { open: '09:00', close: '15:00', isOpen: true }
        },
        contact: {
          phone: '+84 28 1234 5678',
          email: 'central@bloodcenter.vn'
        }
      }
    ];
  }

  private mockGetTimeSlots(): TimeSlot[] {
    return [
      { id: '1', startTime: '08:00', endTime: '08:30', isAvailable: true, capacity: 4, bookedCount: 1 },
      { id: '2', startTime: '08:30', endTime: '09:00', isAvailable: true, capacity: 4, bookedCount: 2 },
      { id: '3', startTime: '09:00', endTime: '09:30', isAvailable: true, capacity: 4, bookedCount: 0 },
      { id: '4', startTime: '09:30', endTime: '10:00', isAvailable: false, capacity: 4, bookedCount: 4 },
      { id: '5', startTime: '10:00', endTime: '10:30', isAvailable: true, capacity: 4, bookedCount: 1 }
    ];
  }

  private calculateAge(dateOfBirth: Date): number {
    return Math.floor((Date.now() - dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  }
}

export default DonationsService.getInstance();