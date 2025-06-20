import React from 'react';
import { Calendar, MapPin, AlertTriangle, CheckCircle, Clock, Filter, Download, Eye } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import SearchBar from '../../../components/forms/SearchBar';
import { BloodUnit, BloodType, BloodComponent, BloodUnitStatus, InventoryFilters } from '../types/inventory.types';

export interface InventoryTableProps {
  data: BloodUnit[];
  loading?: boolean;
  filters: InventoryFilters;
  onFiltersChange: (filters: InventoryFilters) => void;
  onViewDetails: (unit: BloodUnit) => void;
  onExport: () => void;
  className?: string;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  data,
  loading = false,
  filters,
  onFiltersChange,
  onViewDetails,
  onExport,
  className = ''
}) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof BloodUnit;
    direction: 'asc' | 'desc';
  }>({ key: 'expirationDate', direction: 'asc' });

  const getStatusBadge = (status: BloodUnitStatus) => {
    const statusConfig = {
      'available': { variant: 'success' as const, label: 'Available' },
      'reserved': { variant: 'warning' as const, label: 'Reserved' },
      'issued': { variant: 'info' as const, label: 'Issued' },
      'expired': { variant: 'danger' as const, label: 'Expired' },
      'testing': { variant: 'warning' as const, label: 'Testing' },
      'processing': { variant: 'info' as const, label: 'Processing' },
      'collected': { variant: 'info' as const, label: 'Collected' },
      'discarded': { variant: 'danger' as const, label: 'Discarded' },
      'quarantined': { variant: 'danger' as const, label: 'Quarantined' },
      'recalled': { variant: 'danger' as const, label: 'Recalled' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getExpirationStatus = (expirationDate: Date) => {
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration < 0) {
      return <Badge variant="danger" dot>Expired</Badge>;
    } else if (daysUntilExpiration <= 3) {
      return <Badge variant="danger" dot>Expires in {daysUntilExpiration} days</Badge>;
    } else if (daysUntilExpiration <= 7) {
      return <Badge variant="warning" dot>Expires in {daysUntilExpiration} days</Badge>;
    } else {
      return <Badge variant="success" dot>{daysUntilExpiration} days left</Badge>;
    }
  };

  const getBloodTypeBadge = (bloodType: BloodType) => {
    return <Badge variant="blood-type" size="sm">{bloodType}</Badge>;
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
      day: 'numeric'
    });
  };

  const handleSort = (key: keyof BloodUnit) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSearch = (query: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: query
    });
  };

  const columns = [
    {
      key: 'id' as keyof BloodUnit,
      label: 'Unit ID',
      sortable: true,
      render: (value: string, unit: BloodUnit) => (
        <div className="font-mono text-sm">
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">Donor: {unit.donorId}</div>
        </div>
      )
    },
    {
      key: 'bloodType' as keyof BloodUnit,
      label: 'Blood Type',
      sortable: true,
      render: (value: BloodType) => getBloodTypeBadge(value)
    },
    {
      key: 'component' as keyof BloodUnit,
      label: 'Component',
      sortable: true,
      render: (value: BloodComponent) => (
        <div className="text-sm">
          <div className="font-medium">{getComponentLabel(value)}</div>
        </div>
      )
    },
    {
      key: 'volume' as keyof BloodUnit,
      label: 'Volume',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{value} ml</span>
      )
    },
    {
      key: 'collectionDate' as keyof BloodUnit,
      label: 'Collection Date',
      sortable: true,
      render: (value: Date) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            {formatDate(value)}
          </div>
        </div>
      )
    },
    {
      key: 'expirationDate' as keyof BloodUnit,
      label: 'Expiration',
      sortable: true,
      render: (value: Date, unit: BloodUnit) => (
        <div className="space-y-1">
          <div className="text-sm">{formatDate(value)}</div>
          {getExpirationStatus(value)}
        </div>
      )
    },
    {
      key: 'status' as keyof BloodUnit,
      label: 'Status',
      sortable: true,
      render: (value: BloodUnitStatus) => getStatusBadge(value)
    },
    {
      key: 'location' as keyof BloodUnit,
      label: 'Location',
      render: (value: any, unit: BloodUnit) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{unit.location.room}</span>
          </div>
          <div className="text-xs text-gray-500">
            {unit.location.refrigerator} - {unit.location.shelf}
          </div>
        </div>
      )
    },
    {
      key: 'actions' as keyof BloodUnit,
      label: 'Actions',
      render: (value: any, unit: BloodUnit) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => onViewDetails(unit)}
          >
            View
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SearchBar
            value={filters.searchQuery || ''}
            onChange={handleSearch}
            placeholder="Search by unit ID, donor ID, or location..."
            showFilter={true}
            onFilter={() => {/* Handle filter modal */}}
            className="w-96"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={onExport}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <Table
        data={data}
        columns={columns}
        loading={loading}
        sortConfig={sortConfig}
        onSort={handleSort}
        searchable={false}
        emptyMessage="No blood units found matching your criteria"
      />
    </div>
  );
};

export default InventoryTable;