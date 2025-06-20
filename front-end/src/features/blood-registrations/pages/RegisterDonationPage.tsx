import React from 'react';
import { Heart } from 'lucide-react';
import Card from '../../../components/ui/Card';
import DonationForm from '../components/DonationForm';
import EligibilityChecker from '../components/EligibilityChecker';
import DonationScheduler from '../components/DonationScheduler';
import DonationConfirmation from '../components/DonationConfirmation';
import { useDonationRegistration } from '../hooks/useDonationRegistration';
import { 
  DonationFormData, 
  EligibilityCheck, 
  DonationRegistration,
  TimeSlot,
  DonationLocation
} from '../types/donation.types';

type RegistrationStep = 'form' | 'eligibility' | 'schedule' | 'confirmation';

const RegisterDonationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState<RegistrationStep>('form');
  const [formData, setFormData] = React.useState<Partial<DonationFormData>>({});
  const [eligibility, setEligibility] = React.useState<EligibilityCheck | null>(null);
  const [selectedLocation, setSelectedLocation] = React.useState<DonationLocation | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<TimeSlot | null>(null);
  const [registration, setRegistration] = React.useState<DonationRegistration | null>(null);

  const { submitRegistration, isSubmitting, error, clearError } = useDonationRegistration();

  const handleFormSubmit = async (data: DonationFormData) => {
    setFormData(data);
    setCurrentStep('eligibility');
  };

  const handleEligibilityChange = (eligibilityResult: EligibilityCheck) => {
    setEligibility(eligibilityResult);
    if (eligibilityResult.isEligible) {
      setTimeout(() => {
        setCurrentStep('schedule');
      }, 2000);
    }
  };

  const handleScheduleComplete = () => {
    if (selectedLocation && selectedDate && selectedTimeSlot) {
      setCurrentStep('confirmation');
      handleRegistrationSubmit();
    }
  };

  const handleRegistrationSubmit = async () => {
    if (!formData || !selectedLocation || !selectedDate || !selectedTimeSlot) return;

    try {
      const completeData: DonationFormData = {
        ...formData as DonationFormData,
        preferredDate: selectedDate,
        preferredTime: selectedTimeSlot.startTime,
        locationId: selectedLocation.id
      };

      const registrationResult = await submitRegistration(completeData);
      setRegistration(registrationResult);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('form');
    setFormData({});
    setEligibility(null);
    setSelectedLocation(null);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setRegistration(null);
    clearError();
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'form', label: 'Registration Form', number: 1 },
      { key: 'eligibility', label: 'Eligibility Check', number: 2 },
      { key: 'schedule', label: 'Schedule Appointment', number: 3 },
      { key: 'confirmation', label: 'Confirmation', number: 4 }
    ];

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors duration-200 ${
                  currentStep === step.key
                    ? 'bg-red-600 border-red-600 text-white'
                    : steps.findIndex(s => s.key === currentStep) > index
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {steps.findIndex(s => s.key === currentStep) > index ? '✓' : step.number}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                currentStep === step.key ? 'text-red-600' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 transition-colors duration-200 ${
                  steps.findIndex(s => s.key === currentStep) > index ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'form':
        return (
          <DonationForm
            onSubmit={handleFormSubmit}
            onDataChange={setFormData}
            initialData={formData}
            isSubmitting={false}
          />
        );

      case 'eligibility':
        return (
          <div className="space-y-6">
            <EligibilityChecker
              formData={formData}
              onEligibilityChange={handleEligibilityChange}
            />
            {eligibility && !eligibility.isEligible && (
              <div className="text-center">
                <button
                  onClick={handleStartOver}
                  className="text-red-600 hover:text-red-700 underline"
                >
                  Update Registration Information
                </button>
              </div>
            )}
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <DonationScheduler
              donationType={formData.donationType || 'whole-blood'}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              selectedLocation={selectedLocation}
              onDateSelect={setSelectedDate}
              onTimeSlotSelect={setSelectedTimeSlot}
              onLocationSelect={setSelectedLocation}
            />
            {selectedLocation && selectedDate && selectedTimeSlot && (
              <div className="text-center">
                <button
                  onClick={handleScheduleComplete}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Confirm Appointment
                </button>
              </div>
            )}
          </div>
        );

      case 'confirmation':
        return registration && selectedLocation && selectedTimeSlot ? (
          <DonationConfirmation
            registration={registration}
            location={selectedLocation}
            timeSlot={selectedTimeSlot}
            onDownloadConfirmation={() => console.log('Download confirmation')}
            onShareAppointment={() => console.log('Share appointment')}
            onModifyAppointment={() => setCurrentStep('schedule')}
          />
        ) : (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Processing your registration...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blood Donation Registration</h1>
          <p className="text-lg text-gray-600">
            Join our community of heroes and help save lives through blood donation
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Error Display */}
        {error && (
          <Card variant="bordered" className="mb-6 border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <div>
                <h4 className="font-medium text-red-900">Registration Error</h4>
                <p className="text-red-800">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </Card>
        )}

        {/* Current Step Content */}
        {renderCurrentStep()}

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-8 text-center">
              <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Registration</h3>
              <p className="text-gray-600">Please wait while we set up your donation appointment...</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterDonationPage;