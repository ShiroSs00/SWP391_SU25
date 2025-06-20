import React from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { TimeSlot, DonationLocation, DonationType } from '../types/donation.types';

export interface DonationSchedulerProps {
  donationType: DonationType;
  selectedDate?: Date;
  selectedTimeSlot?: TimeSlot;
  selectedLocation?: DonationLocation;
  onDateSelect: (date: Date) => void;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  onLocationSelect: (location: DonationLocation) => void;
  className?: string;
}

// Mock data - in real app this would come from API
const mockLocations: DonationLocation[] = [
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
  },
  {
    id: '2',
    name: 'District 1 Mobile Unit',
    address: 'Ben Thanh Market Area, District 1',
    facilities: ['Mobile Unit', 'Medical Equipment', 'Refreshments'],
    operatingHours: {
      monday: { open: '09:00', close: '16:00', isOpen: true },
      tuesday: { open: '09:00', close: '16:00', isOpen: true },
      wednesday: { open: '09:00', close: '16:00', isOpen: true },
      thursday: { open: '09:00', close: '16:00', isOpen: true },
      friday: { open: '09:00', close: '16:00', isOpen: true },
      saturday: { open: '09:00', close: '14:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false }
    },
    contact: {
      phone: '+84 28 8765 4321',
      email: 'mobile1@bloodcenter.vn'
    }
  }
];

const mockTimeSlots: TimeSlot[] = [
  { id: '1', startTime: '08:00', endTime: '08:30', isAvailable: true, capacity: 4, bookedCount: 1 },
  { id: '2', startTime: '08:30', endTime: '09:00', isAvailable: true, capacity: 4, bookedCount: 2 },
  { id: '3', startTime: '09:00', endTime: '09:30', isAvailable: true, capacity: 4, bookedCount: 0 },
  { id: '4', startTime: '09:30', endTime: '10:00', isAvailable: false, capacity: 4, bookedCount: 4 },
  { id: '5', startTime: '10:00', endTime: '10:30', isAvailable: true, capacity: 4, bookedCount: 1 },
  { id: '6', startTime: '10:30', endTime: '11:00', isAvailable: true, capacity: 4, bookedCount: 3 },
  { id: '7', startTime: '11:00', endTime: '11:30', isAvailable: true, capacity: 4, bookedCount: 0 },
  { id: '8', startTime: '11:30', endTime: '12:00', isAvailable: true, capacity: 4, bookedCount: 2 },
  { id: '9', startTime: '14:00', endTime: '14:30', isAvailable: true, capacity: 4, bookedCount: 1 },
  { id: '10', startTime: '14:30', endTime: '15:00', isAvailable: true, capacity: 4, bookedCount: 0 },
  { id: '11', startTime: '15:00', endTime: '15:30', isAvailable: true, capacity: 4, bookedCount: 2 },
  { id: '12', startTime: '15:30', endTime: '16:00', isAvailable: true, capacity: 4, bookedCount: 1 }
];

const DonationScheduler: React.FC<DonationSchedulerProps> = ({
  donationType,
  selectedDate,
  selectedTimeSlot,
  selectedLocation,
  onDateSelect,
  onTimeSlotSelect,
  onLocationSelect,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = React.useState<'location' | 'date' | 'time'>('location');

  const getDonationDuration = (type: DonationType): number => {
    switch (type) {
      case 'whole-blood': return 45;
      case 'plasma': return 75;
      case 'platelets': return 180;
      case 'red-cells': return 60;
      case 'double-red': return 90;
      default: return 45;
    }
  };

  const generateCalendarDays = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, monthIndex, i);
      const isToday = date.toDateString() === new Date().toDateString();
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      days.push({
        date,
        day: i,
        isToday,
        isPast,
        isSelected,
        isWeekend,
        isAvailable: !isPast && (selectedLocation?.operatingHours[getDayName(date.getDay())]?.isOpen || false)
      });
    }
    
    return days;
  };

  const getDayName = (dayIndex: number): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayIndex];
  };

  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const calendarDays = generateCalendarDays(currentMonth);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderLocationSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Donation Location</h3>
        <p className="text-gray-600">Select a convenient location for your donation</p>
      </div>

      {mockLocations.map(location => (
        <Card
          key={location.id}
          variant={selectedLocation?.id === location.id ? 'gradient' : 'bordered'}
          padding="md"
          className={`cursor-pointer transition-all duration-200 ${
            selectedLocation?.id === location.id ? 'ring-2 ring-red-500' : 'hover:border-red-300'
          }`}
          onClick={() => {
            onLocationSelect(location);
            setCurrentStep('date');
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-gray-900">{location.name}</h4>
                {selectedLocation?.id === location.id && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <p className="text-gray-600 mb-3">{location.address}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {location.facilities.map(facility => (
                  <Badge key={facility} variant="info" size="sm">{facility}</Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Mon-Fri: {location.operatingHours.monday.open}-{location.operatingHours.monday.close}
                </span>
                <span>📞 {location.contact.phone}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderDateSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Date</h3>
        <p className="text-gray-600">Choose your preferred donation date</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            ←
          </button>
          <h4 className="font-semibold text-gray-900">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <button
              key={index}
              disabled={!day || !day.isAvailable || day.isPast}
              onClick={() => {
                if (day?.isAvailable && !day.isPast) {
                  onDateSelect(day.date);
                  setCurrentStep('time');
                }
              }}
              className={`p-3 text-sm rounded-md transition-colors duration-200 ${
                !day 
                  ? 'invisible' 
                  : day.isPast || !day.isAvailable
                  ? 'text-gray-300 cursor-not-allowed'
                  : day.isSelected
                  ? 'bg-red-600 text-white'
                  : day.isToday
                  ? 'bg-blue-100 text-blue-900 font-semibold'
                  : 'hover:bg-red-50 text-gray-900'
              }`}
            >
              {day?.day}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 rounded" />
          <span className="text-gray-600">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded" />
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded" />
          <span className="text-gray-600">Unavailable</span>
        </div>
      </div>
    </div>
  );

  const renderTimeSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Time Slot</h3>
        <p className="text-gray-600">
          Choose your preferred time ({getDonationDuration(donationType)} minutes duration)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {mockTimeSlots.map(timeSlot => {
          const availableSpots = timeSlot.capacity - timeSlot.bookedCount;
          
          return (
            <button
              key={timeSlot.id}
              disabled={!timeSlot.isAvailable}
              onClick={() => {
                if (timeSlot.isAvailable) {
                  onTimeSlotSelect(timeSlot);
                }
              }}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedTimeSlot?.id === timeSlot.id
                  ? 'bg-red-600 border-red-600 text-white'
                  : timeSlot.isAvailable
                  ? 'bg-white border-gray-300 text-gray-900 hover:border-red-300 hover:bg-red-50'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">
                  {timeSlot.startTime} - {timeSlot.endTime}
                </div>
                <div className="text-xs mt-1 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  {timeSlot.isAvailable ? (
                    <span>{availableSpots} spots left</span>
                  ) : (
                    <span>Fully booked</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedTimeSlot && (
        <Card variant="gradient" padding="sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">
                Time Slot Selected: {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
              </p>
              <p className="text-sm text-gray-600">
                Duration: {getDonationDuration(donationType)} minutes
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'location': return renderLocationSelection();
      case 'date': return renderDateSelection();
      case 'time': return renderTimeSelection();
      default: return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'location': return !!selectedLocation;
      case 'date': return !!selectedDate;
      case 'time': return !!selectedTimeSlot;
      default: return false;
    }
  };

  return (
    <Card className={className}>
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          {['location', 'date', 'time'].map((step, index) => (
            <React.Fragment key={step}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200 ${
                  currentStep === step
                    ? 'bg-red-600 border-red-600 text-white'
                    : (step === 'location' && selectedLocation) ||
                      (step === 'date' && selectedDate) ||
                      (step === 'time' && selectedTimeSlot)
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {(step === 'location' && selectedLocation) ||
                 (step === 'date' && selectedDate) ||
                 (step === 'time' && selectedTimeSlot) ? '✓' : index + 1}
              </div>
              {index < 2 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors duration-200 ${
                    (step === 'location' && selectedLocation) ||
                    (step === 'date' && selectedDate)
                      ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between text-sm font-medium text-gray-600">
          <span className={currentStep === 'location' ? 'text-red-600' : ''}>Location</span>
          <span className={currentStep === 'date' ? 'text-red-600' : ''}>Date</span>
          <span className={currentStep === 'time' ? 'text-red-600' : ''}>Time</span>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => {
              if (currentStep === 'date') setCurrentStep('location');
              else if (currentStep === 'time') setCurrentStep('date');
            }}
            disabled={currentStep === 'location'}
          >
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {selectedLocation && selectedDate && selectedTimeSlot && (
              <Badge variant="success" dot>
                Schedule Complete
              </Badge>
            )}
          </div>
        </div>

        {/* Summary */}
        {selectedLocation && (
          <Card variant="bordered" padding="sm">
            <h4 className="font-medium text-gray-900 mb-3">Appointment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{selectedLocation.name}</span>
              </div>
              {selectedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {selectedTimeSlot && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</span>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};

export default DonationScheduler;