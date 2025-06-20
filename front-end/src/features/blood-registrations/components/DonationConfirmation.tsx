import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, Heart, Phone, Mail, Download, Share } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { DonationRegistration, DonationLocation, TimeSlot } from '../types/donation.types';

export interface DonationConfirmationProps {
  registration: DonationRegistration;
  location: DonationLocation;
  timeSlot: TimeSlot;
  onDownloadConfirmation?: () => void;
  onShareAppointment?: () => void;
  onModifyAppointment?: () => void;
  className?: string;
}

const DonationConfirmation: React.FC<DonationConfirmationProps> = ({
  registration,
  location,
  timeSlot,
  onDownloadConfirmation,
  onShareAppointment,
  onModifyAppointment,
  className = ''
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDonationTypeLabel = (type: string) => {
    const labels = {
      'whole-blood': 'Whole Blood',
      'plasma': 'Plasma',
      'platelets': 'Platelets',
      'red-cells': 'Red Cells',
      'double-red': 'Double Red Cells'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getDonationDuration = (type: string) => {
    const durations = {
      'whole-blood': 45,
      'plasma': 75,
      'platelets': 180,
      'red-cells': 60,
      'double-red': 90
    };
    return durations[type as keyof typeof durations] || 45;
  };

  const preparationInstructions = [
    'Eat a healthy meal 2-3 hours before your appointment',
    'Drink plenty of water (at least 16 oz) before donation',
    'Get a good night\'s sleep (at least 7-8 hours)',
    'Avoid alcohol for 24 hours before donation',
    'Bring a valid photo ID',
    'Wear comfortable clothing with sleeves that can be rolled up',
    'Avoid heavy exercise 24 hours before donation'
  ];

  const postDonationCare = [
    'Rest for 10-15 minutes after donation',
    'Drink extra fluids for the next 24-48 hours',
    'Eat iron-rich foods (red meat, fish, poultry, beans, spinach)',
    'Avoid heavy lifting or strenuous exercise for 4-6 hours',
    'Keep the bandage on for 4-6 hours',
    'If you feel dizzy or faint, lie down and elevate your legs'
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Success Header */}
      <Card variant="gradient" padding="lg" className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Registration Confirmed!
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Thank you for your generous decision to donate blood. Your contribution will help save lives.
        </p>
        <Badge variant="success" size="lg">
          Appointment ID: {registration.id.toUpperCase()}
        </Badge>
      </Card>

      {/* Appointment Details */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-semibold text-gray-900">Appointment Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Date</p>
                <p className="text-gray-600">{formatDate(registration.scheduledDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Time</p>
                <p className="text-gray-600">
                  {timeSlot.startTime} - {timeSlot.endTime}
                  <span className="text-sm text-gray-500 ml-2">
                    ({getDonationDuration(registration.donationType)} minutes)
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Donation Type</p>
                <p className="text-gray-600">{getDonationTypeLabel(registration.donationType)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-gray-600">{location.name}</p>
                <p className="text-sm text-gray-500">{location.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Contact</p>
                <p className="text-gray-600">{location.contact.phone}</p>
                <p className="text-sm text-gray-500">{location.contact.email}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          leftIcon={<Download className="w-4 h-4" />}
          onClick={onDownloadConfirmation}
          variant="outline"
        >
          Download Confirmation
        </Button>
        <Button
          leftIcon={<Share className="w-4 h-4" />}
          onClick={onShareAppointment}
          variant="outline"
        >
          Share Appointment
        </Button>
        <Button
          onClick={onModifyAppointment}
          variant="ghost"
        >
          Modify Appointment
        </Button>
      </div>

      {/* Preparation Instructions */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Preparation Guidelines</h3>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 font-medium mb-2">Important: Please follow these guidelines to ensure a successful donation</p>
        </div>

        <div className="space-y-3">
          {preparationInstructions.map((instruction, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-blue-600">{index + 1}</span>
              </div>
              <p className="text-gray-700">{instruction}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Post-Donation Care */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Post-Donation Care</h3>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-medium mb-2">After your donation, please follow these care instructions</p>
        </div>

        <div className="space-y-3">
          {postDonationCare.map((instruction, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-medium text-green-600">{index + 1}</span>
              </div>
              <p className="text-gray-700">{instruction}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card variant="bordered">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-semibold text-gray-900">Emergency & Support</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">24/7 Support Hotline</h4>
            <p className="text-red-800 font-semibold">+84 28 1234 5678</p>
            <p className="text-sm text-red-700">For any post-donation concerns or emergencies</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Appointment Support</h4>
            <p className="text-blue-800 font-semibold">support@bloodcenter.vn</p>
            <p className="text-sm text-blue-700">For rescheduling or appointment questions</p>
          </div>
        </div>
      </Card>

      {/* Thank You Message */}
      <Card variant="gradient" padding="lg" className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Heart className="w-12 h-12 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Being a Hero!</h3>
        <p className="text-gray-600 mb-4">
          Your blood donation can save up to 3 lives. You are making a tremendous difference 
          in our community's health and wellbeing.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="text-center">
            <p className="font-semibold text-2xl text-red-600">3</p>
            <p>Lives Saved</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-2xl text-red-600">450ml</p>
            <p>Blood Donated</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-2xl text-red-600">56</p>
            <p>Days Until Next</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DonationConfirmation;