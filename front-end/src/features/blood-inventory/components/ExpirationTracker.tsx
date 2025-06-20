import React from 'react';
import { Calendar, Clock, AlertTriangle, TrendingDown, Filter } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { BloodUnit, BloodType, BloodComponent } from '../types/inventory.types';

export interface ExpirationTrackerProps {
  units: BloodUnit[];
  onViewUnit?: (unit: BloodUnit) => void;
  onBulkAction?: (unitIds: string[], action: 'extend' | 'discard' | 'priority') => void;
  className?: string;
}

interface ExpirationGroup {
  category: 'expired' | 'today' | 'tomorrow' | 'week' | 'month';
  label: string;
  units: BloodUnit[];
  severity: 'critical' | 'high' | 'medium' | 'low';
}

const ExpirationTracker: React.FC<ExpirationTrackerProps> = ({
  units,
  onViewUnit,
  onBulkAction,
  className = ''
}) => {
  const [selectedUnits, setSelectedUnits] = React.useState<Set<string>>(new Set());
  const [filterBloodType, setFilterBloodType] = React.useState<BloodType | 'all'>('all');
  const [filterComponent, setFilterComponent] = React.useState<BloodComponent | 'all'>('all');

  const categorizeByExpiration = (units: BloodUnit[]): ExpirationGroup[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const groups: ExpirationGroup[] = [
      { category: 'expired', label: 'Expired', units: [], severity: 'critical' },
      { category: 'today', label: 'Expires Today', units: [], severity: 'critical' },
      { category: 'tomorrow', label: 'Expires Tomorrow', units: [], severity: 'high' },
      { category: 'week', label: 'Expires This Week', units: [], severity: 'medium' },
      { category: 'month', label: 'Expires This Month', units: [], severity: 'low' }
    ];

    units.forEach(unit => {
      const expirationDate = new Date(unit.expirationDate.getFullYear(), 
                                     unit.expirationDate.getMonth(), 
                                     unit.expirationDate.getDate());

      if (expirationDate < today) {
        groups[0].units.push(unit);
      } else if (expirationDate.getTime() === today.getTime()) {
        groups[1].units.push(unit);
      } else if (expirationDate.getTime() === tomorrow.getTime()) {
        groups[2].units.push(unit);
      } else if (expirationDate <= nextWeek) {
        groups[3].units.push(unit);
      } else if (expirationDate <= nextMonth) {
        groups[4].units.push(unit);
      }
    });

    return groups.filter(group => group.units.length > 0);
  };

  const filteredUnits = units.filter(unit => {
    const bloodTypeMatch = filterBloodType === 'all' || unit.bloodType === filterBloodType;
    const componentMatch = filterComponent === 'all' || unit.component === filterComponent;
    return bloodTypeMatch && componentMatch;
  });

  const expirationGroups = categorizeByExpiration(filteredUnits);

  const getSeverityColor = (severity: string) => {
    const colors = {
      'critical': 'border-red-500 bg-red-50',
      'high': 'border-orange-500 bg-orange-50',
      'medium': 'border-yellow-500 bg-yellow-50',
      'low': 'border-blue-500 bg-blue-50'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      'critical': 'danger' as const,
      'high': 'warning' as const,
      'medium': 'warning' as const,
      'low': 'info' as const
    };
    return variants[severity as keyof typeof variants] || 'info';
  };

  const handleUnitSelect = (unitId: string, selected: boolean) => {
    const newSelected = new Set(selectedUnits);
    if (selected) {
      newSelected.add(unitId);
    } else {
      newSelected.delete(unitId);
    }
    setSelectedUnits(newSelected);
  };

  const handleSelectAll = (units: BloodUnit[], selected: boolean) => {
    const newSelected = new Set(selectedUnits);
    units.forEach(unit => {
      if (selected) {
        newSelected.add(unit.id);
      } else {
        newSelected.delete(unit.id);
      }
    });
    setSelectedUnits(newSelected);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiration = (expirationDate: Date) => {
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const components: BloodComponent[] = ['whole-blood', 'red-blood-cells', 'plasma', 'platelets'];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Expiration Tracker</h2>
          <p className="text-gray-600">Monitor blood units approaching expiration</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={filterBloodType}
            onChange={(e) => setFilterBloodType(e.target.value as BloodType | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Blood Types</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={filterComponent}
            onChange={(e) => setFilterComponent(e.target.value as BloodComponent | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Components</option>
            {components.map(component => (
              <option key={component} value={component}>
                {component.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUnits.size > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedUnits.size} units selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkAction?.(Array.from(selectedUnits), 'priority')}
              >
                Mark Priority
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onBulkAction?.(Array.from(selectedUnits), 'discard')}
              >
                Discard Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Expiration Groups */}
      <div className="space-y-4">
        {expirationGroups.map(group => (
          <Card 
            key={group.category}
            className={`border-l-4 ${getSeverityColor(group.severity)}`}
          >
            <div className="space-y-4">
              {/* Group Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {group.severity === 'critical' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                    {group.severity === 'high' && <Clock className="w-5 h-5 text-orange-600" />}
                    {group.severity === 'medium' && <Calendar className="w-5 h-5 text-yellow-600" />}
                    {group.severity === 'low' && <TrendingDown className="w-5 h-5 text-blue-600" />}
                    
                    <h3 className="text-lg font-semibold text-gray-900">{group.label}</h3>
                    <Badge variant={getSeverityBadge(group.severity)}>
                      {group.units.length} units
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={group.units.every(unit => selectedUnits.has(unit.id))}
                    onChange={(e) => handleSelectAll(group.units, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm text-gray-600">Select All</label>
                </div>
              </div>

              {/* Units List */}
              <div className="space-y-2">
                {group.units.map(unit => {
                  const daysLeft = getDaysUntilExpiration(unit.expirationDate);
                  
                  return (
                    <div
                      key={unit.id}
                      className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUnits.has(unit.id)}
                        onChange={(e) => handleUnitSelect(unit.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      
                      <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                        <div>
                          <div className="font-mono text-sm font-medium">{unit.id}</div>
                          <div className="text-xs text-gray-500">Unit ID</div>
                        </div>
                        
                        <div>
                          <Badge variant="blood-type" size="sm">{unit.bloodType}</Badge>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">
                            {unit.component.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-xs text-gray-500">{unit.volume} ml</div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">{formatDate(unit.expirationDate)}</div>
                          <div className="text-xs text-gray-500">
                            {daysLeft < 0 ? 'Expired' : `${daysLeft} days left`}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm">{unit.location.room}</div>
                          <div className="text-xs text-gray-500">{unit.location.shelf}</div>
                        </div>
                        
                        <div>
                          <Badge variant={unit.status === 'available' ? 'success' : 'warning'} size="sm">
                            {unit.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewUnit?.(unit)}
                      >
                        View
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {expirationGroups.length === 0 && (
        <Card className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Expiring Units</h3>
          <p className="text-gray-600">No blood units are expiring in the selected timeframe.</p>
        </Card>
      )}
    </div>
  );
};

export default ExpirationTracker;