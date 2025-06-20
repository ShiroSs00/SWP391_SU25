import React from 'react';
import { DonationFormData, DonationRegistration, EligibilityCheck } from '../types/donation.types';

export interface UseDonationRegistrationReturn {
  submitRegistration: (data: DonationFormData) => Promise<DonationRegistration>;
  isSubmitting: boolean;
  error: string | null;
  clearError: () => void;
}

export const useDonationRegistration = (): UseDonationRegistrationReturn => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submitRegistration = async (data: DonationFormData): Promise<DonationRegistration> => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create registration object
      const registration: DonationRegistration = {
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
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // In a real app, this would be sent to the backend
      console.log('Registration submitted:', registration);

      return registration;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    submitRegistration,
    isSubmitting,
    error,
    clearError
  };
};

export default useDonationRegistration;