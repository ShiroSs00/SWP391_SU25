import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, Info } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { EligibilityCheck, EligibilityReason, DonationFormData } from '../types/donation.types';

export interface EligibilityCheckerProps {
  formData: Partial<DonationFormData>;
  onEligibilityChange: (eligibility: EligibilityCheck) => void;
  className?: string;
}

const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  formData,
  onEligibilityChange,
  className = ''
}) => {
  const [eligibility, setEligibility] = React.useState<EligibilityCheck | null>(null);
  const [isChecking, setIsChecking] = React.useState(false);

  const checkEligibility = React.useCallback(async () => {
    setIsChecking(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const reasons: EligibilityReason[] = [];
    let score = 100;
    
    // Age check (18-65)
    if (formData.dateOfBirth) {
      const age = Math.floor((Date.now() - formData.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) {
        reasons.push({
          type: 'age',
          severity: 'error',
          message: 'Must be at least 18 years old to donate blood',
          disqualifying: true
        });
        score -= 50;
      } else if (age > 65) {
        reasons.push({
          type: 'age',
          severity: 'warning',
          message: 'Donors over 65 require additional medical clearance',
          disqualifying: false
        });
        score -= 10;
      }
    }
    
    // Weight check (minimum 110 lbs / 50kg)
    if (formData.weight && formData.weight < 50) {
      reasons.push({
        type: 'weight',
        severity: 'error',
        message: 'Minimum weight requirement is 50kg (110 lbs)',
        disqualifying: true
      });
      score -= 40;
    }
    
    // Medical history checks
    if (formData.medicalHistory) {
      const { medicalHistory } = formData;
      
      if (medicalHistory.hasChronicIllness && medicalHistory.chronicIllnesses?.length) {
        const seriousConditions = ['diabetes', 'heart disease', 'cancer', 'hiv', 'hepatitis'];
        const hasSeriousCondition = medicalHistory.chronicIllnesses.some(illness => 
          seriousConditions.some(condition => illness.toLowerCase().includes(condition))
        );
        
        if (hasSeriousCondition) {
          reasons.push({
            type: 'medical',
            severity: 'error',
            message: 'Chronic medical conditions require medical evaluation',
            disqualifying: true
          });
          score -= 30;
        } else {
          reasons.push({
            type: 'medical',
            severity: 'warning',
            message: 'Medical history will be reviewed by medical staff',
            disqualifying: false
          });
          score -= 5;
        }
      }
      
      if (medicalHistory.takingMedications && medicalHistory.medications?.length) {
        const restrictedMedications = ['aspirin', 'blood thinner', 'anticoagulant'];
        const hasRestrictedMeds = medicalHistory.medications.some(med => 
          restrictedMedications.some(restricted => med.toLowerCase().includes(restricted))
        );
        
        if (hasRestrictedMeds) {
          reasons.push({
            type: 'medical',
            severity: 'warning',
            message: 'Some medications may affect donation eligibility',
            disqualifying: false
          });
          score -= 10;
        }
      }
      
      // Recent surgery check
      if (medicalHistory.hasRecentSurgery && medicalHistory.recentSurgeryDate) {
        const daysSinceSurgery = Math.floor((Date.now() - medicalHistory.recentSurgeryDate.getTime()) / (24 * 60 * 60 * 1000));
        if (daysSinceSurgery < 30) {
          reasons.push({
            type: 'medical',
            severity: 'error',
            message: 'Must wait at least 30 days after surgery before donating',
            disqualifying: true
          });
          score -= 25;
        }
      }
      
      // Recent tattoo check
      if (medicalHistory.hasRecentTattoo && medicalHistory.recentTattooDate) {
        const daysSinceTattoo = Math.floor((Date.now() - medicalHistory.recentTattooDate.getTime()) / (24 * 60 * 60 * 1000));
        if (daysSinceTattoo < 90) {
          reasons.push({
            type: 'medical',
            severity: 'warning',
            message: 'Recent tattoo may require 3-month waiting period',
            disqualifying: false
          });
          score -= 15;
        }
      }
      
      // Last donation check
      if (medicalHistory.lastDonationDate) {
        const daysSinceLastDonation = Math.floor((Date.now() - medicalHistory.lastDonationDate.getTime()) / (24 * 60 * 60 * 1000));
        if (daysSinceLastDonation < 56) {
          const nextEligibleDate = new Date(medicalHistory.lastDonationDate);
          nextEligibleDate.setDate(nextEligibleDate.getDate() + 56);
          
          reasons.push({
            type: 'timing',
            severity: 'error',
            message: `Must wait 56 days between whole blood donations. Next eligible: ${nextEligibleDate.toLocaleDateString()}`,
            disqualifying: true
          });
          score -= 40;
        }
      }
      
      // Travel check
      if (medicalHistory.hasRecentTravel && medicalHistory.recentTravelDestinations?.length) {
        const riskAreas = ['malaria endemic areas', 'zika areas'];
        const hasRiskTravel = medicalHistory.recentTravelDestinations.some(dest => 
          riskAreas.some(risk => dest.toLowerCase().includes(risk))
        );
        
        if (hasRiskTravel) {
          reasons.push({
            type: 'travel',
            severity: 'warning',
            message: 'Recent travel to certain areas may require waiting period',
            disqualifying: false
          });
          score -= 20;
        }
      }
    }
    
    // Add positive factors if no major issues
    if (score > 70) {
      reasons.push({
        type: 'info',
        severity: 'info',
        message: 'Thank you for your willingness to donate blood and help save lives!',
        disqualifying: false
      });
    }
    
    const isEligible = score >= 70 && !reasons.some(r => r.disqualifying);
    
    const eligibilityResult: EligibilityCheck = {
      isEligible,
      score: Math.max(0, score),
      reasons,
      recommendations: [
        'Eat a healthy meal before donation',
        'Drink plenty of water',
        'Get a good night\'s sleep',
        'Bring a valid ID',
        'Wear comfortable clothing with sleeves that can be rolled up'
      ]
    };
    
    setEligibility(eligibilityResult);
    onEligibilityChange(eligibilityResult);
    setIsChecking(false);
  }, [formData, onEligibilityChange]);

  React.useEffect(() => {
    // Auto-check eligibility when form data changes significantly
    if (formData.dateOfBirth && formData.weight && formData.medicalHistory) {
      checkEligibility();
    }
  }, [formData.dateOfBirth, formData.weight, formData.medicalHistory, checkEligibility]);

  const getStatusIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusBadge = () => {
    if (!eligibility) return null;
    
    if (eligibility.isEligible) {
      return <Badge variant="success" dot>Eligible to Donate</Badge>;
    } else {
      const hasDisqualifying = eligibility.reasons.some(r => r.disqualifying);
      return (
        <Badge variant={hasDisqualifying ? 'danger' : 'warning'} dot>
          {hasDisqualifying ? 'Not Eligible' : 'Requires Review'}
        </Badge>
      );
    }
  };

  if (isChecking) {
    return (
      <Card className={className}>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Checking Eligibility</h3>
          <p className="text-gray-600">Reviewing your information for donation eligibility...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Donation Eligibility</h3>
          {getStatusBadge()}
        </div>

        {eligibility && (
          <>
            {/* Eligibility Score */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Eligibility Score</span>
                <span className="text-lg font-bold text-gray-900">{eligibility.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    eligibility.score >= 90 ? 'bg-green-500' :
                    eligibility.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${eligibility.score}%` }}
                />
              </div>
            </div>

            {/* Eligibility Reasons */}
            {eligibility.reasons.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Assessment Details</h4>
                {eligibility.reasons.map((reason, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    {getStatusIcon(reason.severity)}
                    <p className="text-sm text-gray-700 flex-1">{reason.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {eligibility.isEligible && eligibility.recommendations.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Preparation Recommendations
                </h4>
                <ul className="space-y-1">
                  {eligibility.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-green-800 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Eligible Date */}
            {!eligibility.isEligible && eligibility.nextEligibleDate && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Next Eligible Date
                </h4>
                <p className="text-sm text-yellow-800">
                  You will be eligible to donate again on{' '}
                  <span className="font-semibold">
                    {eligibility.nextEligibleDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={checkEligibility}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Re-check Eligibility
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default EligibilityChecker;