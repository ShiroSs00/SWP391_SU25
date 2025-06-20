import React from 'react';
import { Calendar, MapPin, Thermometer, User, TestTube, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { BloodUnit, BloodType, BloodComponent, BloodUnitStatus } from '../types/inventory.types';

export interface BloodUnitCardProps {
  unit: BloodUnit;
  onViewDetails?: (unit: BloodUnit) => void;
  onReserve?: (unit: BloodUnit) => void;
  onIssue?: (unit: BloodUnit) => void;
  onDiscard?: (unit: BloodUnit) => void;
  showActions?: boolean;
  className?: string;
}

const BloodUnitCard: React.FC<BloodUnitCardProps> = ({
  unit,
  onViewDetails,
  onReserve,
  onIssue,
  onDiscard,
  showActions = true,
  className = ''
}) => {
  const getStatusColor = (status: BloodUnitStatus) => {
    const colors = {
      'available': 'bg-green-100 text-green-800 border-green-200',
      'reserved': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'issued': 'bg-blue-100 text-blue-800 border-blue-200',
      'expired': 'bg-red-100 text-red-800 border-red-200',
      'testing': 'bg-orange-100 text-orange-800 border-orange-200',
      'processing': 'bg-purple-100 text-purple-800 border-purple-200',
      'collected': 'bg-gray-100 text-gray-800 border-gray-200',
      'discarded': 'bg-red-100 text-red-800 border-red-200',
      'quarantined': 'bg-red-100 text-red-800 border-red-200',
      'recalled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.available;
  };

  const getExpirationStatus = () => {
    const now = new Date();
    const daysUntilExpiration = Math.ceil((unit.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration < 0) {
      return { status: 'expired', color: 'text-red-600', icon: AlertTriangle, message: 'Expired' };
    } else if (daysUntilExpiration <= 3) {
      return { status: 'critical', color: 'text-red-600', icon: AlertTriangle, message: `Expires in ${daysUntilExpiration} days` };
    } else if (daysUntilExpiration <= 7) {
      return { status: 'warning', color: 'text-yellow-600', icon: Clock, message: `Expires in ${daysUntilExpiration} days` };
    } else {
      return { status: 'good', color: 'text-green-600', icon: CheckCircle, message: `${daysUntilExpiration} days remaining` };
    }
  };

  const getComponentLabel = (component: BloodComponent) => {
    const labels = {
      'whole-blood': 'Whole Blood',
      'red-blood-cells': 'Red Blood Cells',
      'plasma': 'Plasma',
      'platelets': 'Platelets',
      'cryoprecipitate': 'Cryoprecipitate',
      'fresh-frozen-plasma': 'Fresh Frozen Plasma',
      'packed-red-cells': 'Packed Red Cells',
      'platelet-concentrate': 'Platelet Concentrate',
      'granulocytes': 'Granulocytes'
    };
    return labels[component] || component;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const expirationInfo = getExpirationStatus();
  const ExpirationIcon = expirationInfo.icon;

  const isActionable = ['available', 'reserved'].includes(unit.status);

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="blood-type" size="lg">{unit.bloodType}</Badge>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(unit.status)}`}>
                {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Unit #{unit.id}</h3>
            <p className="text-sm text-gray-600">{getComponentLabel(unit.component)}</p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{unit.volume}</div>
            <div className="text-sm text-gray-500">ml</div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Donor:</span>
              <span className="font-medium">{unit.donorId}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Collected:</span>
              <span className="font-medium">{formatDate(unit.collectionDate)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{unit.location.room}-{unit.location.shelf}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <TestTube className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Tests:</span>
              <Badge variant={unit.testResults.approved ? 'success' : 'warning'} size="sm">
                {unit.testResults.approved ? 'Approved' : 'Pending'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Thermometer className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Temp:</span>
              <span className="font-medium">{unit.location.temperature}°C</span>
            </div>
            
            <div className={`flex items-center gap-2 text-sm ${expirationInfo.color}`}>
              <ExpirationIcon className="w-4 h-4" />
              <span className="font-medium">{expirationInfo.message}</span>
            </div>
          </div>
        </div>

        {/* Test Results Summary */}
        {unit.testResults.approved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">All Tests Passed</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-green-800">
              <div>HIV: {unit.testResults.hiv.result}</div>
              <div>Hepatitis B: {unit.testResults.hepatitisB.result}</div>
              <div>Hepatitis C: {unit.testResults.hepatitisC.result}</div>
              <div>Syphilis: {unit.testResults.syphilis.result}</div>
            </div>
          </div>
        )}

        {/* Quality Control */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Quality Control</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>Visual: {unit.qualityControl.visualInspection.color}</div>
            <div>Sterility: {unit.qualityControl.sterilitySeal ? 'Sealed' : 'Compromised'}</div>
            <div>Hemolysis: {unit.qualityControl.visualInspection.hemolysis ? 'Yes' : 'No'}</div>
            <div>Clots: {unit.qualityControl.visualInspection.clots ? 'Present' : 'None'}</div>
          </div>
        </div>

        {/* Actions */}
        {showActions && isActionable && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails?.(unit)}
              className="flex-1"
            >
              View Details
            </Button>
            
            {unit.status === 'available' && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onReserve?.(unit)}
                >
                  Reserve
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onIssue?.(unit)}
                >
                  Issue
                </Button>
              </>
            )}
            
            {unit.status === 'reserved' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => onIssue?.(unit)}
              >
                Issue
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default BloodUnitCard;