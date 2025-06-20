import React from 'react';
import { EligibilityCheck, DonationFormData } from '../types/donation.types';

export interface UseEligibilityReturn {
  checkEligibility: (data: Partial<DonationFormData>) => Promise<EligibilityCheck>;
  isChecking: boolean;
  lastCheck: EligibilityCheck | null;
  error: string | null;
}

export const useEligibility = (): UseEligibilityReturn => {
  const [isChecking, setIsChecking] = React.useState(false);
  const [lastCheck, setLastCheck] = React.useState<EligibilityCheck | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const checkEligibility = async (data: Partial<DonationFormData>): Promise<EligibilityCheck> => {
    setIsChecking(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // This would normally be done on the backend
      const eligibilityResult = performEligibilityCheck(data);
      
      setLastCheck(eligibilityResult);
      return eligibilityResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Eligibility check failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsChecking(false);
    }
  };

  const performEligibilityCheck = (data: Partial<DonationFormData>): EligibilityCheck => {
    const reasons = [];
    let score = 100;

    // Age check
    if (data.dateOfBirth) {
      const age = Math.floor((Date.now() - data.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) {
        reasons.push({
          type: 'age' as const,
          severity: 'error' as const,
          message: 'Must be at least 18 years old to donate blood',
          disqualifying: true
        });
        score -= 50;
      } else if (age > 65) {
        reasons.push({
          type: 'age' as const,
          severity: 'warning' as const,
          message: 'Donors over 65 require additional medical clearance',
          disqualifying: false
        });
        score -= 10;
      }
    }

    // Weight check
    if (data.weight && data.weight < 50) {
      reasons.push({
        type: 'weight' as const,
        severity: 'error' as const,
        message: 'Minimum weight requirement is 50kg (110 lbs)',
        disqualifying: true
      });
      score -= 40;
    }

    // Medical history checks
    if (data.medicalHistory) {
      const { medicalHistory } = data;
      
      if (medicalHistory.hasChronicIllness && medicalHistory.chronicIllnesses?.length) {
        const seriousConditions = ['diabetes', 'heart disease', 'cancer', 'hiv', 'hepatitis'];
        const hasSeriousCondition = medicalHistory.chronicIllnesses.some(illness => 
          seriousConditions.some(condition => illness.toLowerCase().includes(condition))
        );
        
        if (hasSeriousCondition) {
          reasons.push({
            type: 'medical' as const,
            severity: 'error' as const,
            message: 'Chronic medical conditions require medical evaluation',
            disqualifying: true
          });
          score -= 30;
        }
      }

      // Last donation check
      if (medicalHistory.lastDonationDate) {
        const daysSinceLastDonation = Math.floor((Date.now() - medicalHistory.lastDonationDate.getTime()) / (24 * 60 * 60 * 1000));
        if (daysSinceLastDonation < 56) {
          const nextEligibleDate = new Date(medicalHistory.lastDonationDate);
          nextEligibleDate.setDate(nextEligibleDate.getDate() + 56);
          
          reasons.push({
            type: 'timing' as const,
            severity: 'error' as const,
            message: `Must wait 56 days between donations. Next eligible: ${nextEligibleDate.toLocaleDateString()}`,
            disqualifying: true
          });
          score -= 40;
        }
      }
    }

    const isEligible = score >= 70 && !reasons.some(r => r.disqualifying);

    return {
      isEligible,
      score: Math.max(0, score),
      reasons,
      recommendations: [
        'Eat a healthy meal before donation',
        'Drink plenty of water',
        'Get a good night\'s sleep',
        'Bring a valid ID',
        'Wear comfortable clothing'
      ]
    };
  };

  return {
    checkEligibility,
    isChecking,
    lastCheck,
    error
  };
};

export default useEligibility;