import React from 'react';
import { Package, AlertTriangle, TrendingUp, Clock, Download, Plus, Filter } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import InventoryTable from '../components/InventoryTable';
import BloodUnitCard from '../components/BloodUnitCard';
import StockAlert from '../components/StockAlert';
import ExpirationTracker from '../components/ExpirationTracker';
import { useInventory } from '../hooks/useInventory';
import { useStockAlerts } from '../hooks/useStockAlerts';
import { BloodUnit } from '../types/inventory.types';

const InventoryPage: React.FC = () => {
  const {
    units,
    stats,
    loading,
    error,
    filters,
    setFilters,
    refreshInventory,
    reserveUnit,
    issueUnit,
    discardUnit
  } = useInventory();

  const {
    alerts,
    unreadCount,
    acknowledgeAlert,
    resolveAlert,
    dismissAlert
  } = useStockAlerts();

  const [viewMode, setViewMode] = React.useState<'table' | 'cards' | 'expiration'>('table');
  const [selectedUnit, setSelectedUnit] = React.useState<BloodUnit | null>(null);

  const handleViewDetails = (unit: BloodUnit) => {
    setSelectedUnit(unit);
  };

  const handleReserve = async (unit: BloodUnit) => {
    try {
      await reserveUnit(unit.id, 'Hospital Request');
      // Show success message
    } catch (error) {
      console.error('Failed to reserve unit:', error);
    }
  };

  const handleIssue = async (unit: BloodUnit) => {
    try {
      await issueUnit(unit.id, 'Patient Treatment');
      // Show success message
    } catch (error) {
      console.error('Failed to issue unit:', error);
    }
  };

  const handleDiscard = async (unit: BloodUnit) => {
    try {
      await discardUnit(unit.id, 'Expired');
      // Show success message
    } catch (error) {
      console.error('Failed to discard unit:', error);
    }
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting inventory data...');
  };

  const handleBulkAction = (unitIds: string[], action: string) => {
    console.log(`Bulk action ${action} for units:`, unitIds);
  };

  const criticalAlerts = alerts.filter(alert => 
    alert.severity === 'critical' && !alert.resolvedAt
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blood Inventory Management</h1>
            <p className="text-gray-600 mt-2">Monitor and manage blood unit inventory</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExport}
            >
              Export Data
            </Button>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => console.log('Add new unit')}
            >
              Add Unit
            </Button>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Critical Alerts ({criticalAlerts.length})
            </h2>
            <div className="space-y-3">
              {criticalAlerts.slice(0, 3).map(alert => (
                <StockAlert
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={acknowledgeAlert}
                  onResolve={resolveAlert}
                  onDismiss={dismissAlert}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUnits}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableUnits}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table View
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Card View
            </Button>
            <Button
              variant={viewMode === 'expiration' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('expiration')}
            >
              Expiration Tracker
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="info" dot>
              {units.length} units displayed
            </Badge>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'table' && (
          <InventoryTable
            data={units}
            loading={loading}
            filters={filters}
            onFiltersChange={setFilters}
            onViewDetails={handleViewDetails}
            onExport={handleExport}
          />
        )}

        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map(unit => (
              <BloodUnitCard
                key={unit.id}
                unit={unit}
                onViewDetails={handleViewDetails}
                onReserve={handleReserve}
                onIssue={handleIssue}
                onDiscard={handleDiscard}
              />
            ))}
          </div>
        )}

        {viewMode === 'expiration' && (
          <ExpirationTracker
            units={units}
            onViewUnit={handleViewDetails}
            onBulkAction={handleBulkAction}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-600">Loading inventory...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-medium text-red-900">Error Loading Inventory</h3>
                <p className="text-red-800">{error}</p>
              </div>
              <Button
                variant="outline"
                onClick={refreshInventory}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;