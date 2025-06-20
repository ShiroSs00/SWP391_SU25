import React from 'react';
import { BloodUnit, InventoryFilters, InventoryStats } from '../types/inventory.types';

export interface UseInventoryReturn {
  units: BloodUnit[];
  stats: InventoryStats;
  loading: boolean;
  error: string | null;
  filters: InventoryFilters;
  setFilters: (filters: InventoryFilters) => void;
  refreshInventory: () => Promise<void>;
  updateUnit: (unitId: string, updates: Partial<BloodUnit>) => Promise<void>;
  reserveUnit: (unitId: string, reservedFor: string) => Promise<void>;
  issueUnit: (unitId: string, issuedTo: string) => Promise<void>;
  discardUnit: (unitId: string, reason: string) => Promise<void>;
}

export const useInventory = (): UseInventoryReturn => {
  const [units, setUnits] = React.useState<BloodUnit[]>([]);
  const [stats, setStats] = React.useState<InventoryStats>({
    totalUnits: 0,
    availableUnits: 0,
    expiringSoon: 0,
    lowStockAlerts: 0,
    averageAge: 0,
    turnoverRate: 0
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<InventoryFilters>({});

  const generateMockUnits = (): BloodUnit[] => {
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const components = ['whole-blood', 'red-blood-cells', 'plasma', 'platelets'];
    const statuses = ['available', 'reserved', 'issued', 'testing'];
    
    return Array.from({ length: 50 }, (_, i) => {
      const collectionDate = new Date();
      collectionDate.setDate(collectionDate.getDate() - Math.floor(Math.random() * 30));
      
      const expirationDate = new Date(collectionDate);
      expirationDate.setDate(expirationDate.getDate() + 35 + Math.floor(Math.random() * 7));
      
      return {
        id: `BU${String(i + 1).padStart(6, '0')}`,
        donationId: `DON${String(i + 1).padStart(6, '0')}`,
        donorId: `DONOR${String(i + 1).padStart(4, '0')}`,
        bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)] as any,
        component: components[Math.floor(Math.random() * components.length)] as any,
        volume: 450 + Math.floor(Math.random() * 100),
        collectionDate,
        expirationDate,
        status: statuses[Math.floor(Math.random() * statuses.length)] as any,
        location: {
          facility: 'Main Blood Bank',
          building: 'Building A',
          room: `Room ${Math.floor(Math.random() * 10) + 1}`,
          refrigerator: `Ref-${Math.floor(Math.random() * 5) + 1}`,
          shelf: `Shelf-${Math.floor(Math.random() * 10) + 1}`,
          position: `Pos-${Math.floor(Math.random() * 20) + 1}`,
          temperature: 2 + Math.random() * 4,
          lastTemperatureCheck: new Date()
        },
        testResults: {
          hiv: { result: 'negative' },
          hepatitisB: { result: 'negative' },
          hepatitisC: { result: 'negative' },
          syphilis: { result: 'negative' },
          htlv: { result: 'negative' },
          bloodTyping: {
            abo: 'A',
            rh: 'positive',
            antibodies: [],
            crossMatchCompatible: true
          },
          antibodyScreen: { result: 'negative' },
          hemoglobin: 12 + Math.random() * 4,
          hematocrit: 35 + Math.random() * 10,
          plateletCount: 150000 + Math.random() * 300000,
          whiteBloodCellCount: 4000 + Math.random() * 7000,
          testDate: collectionDate,
          technician: `Tech-${Math.floor(Math.random() * 10) + 1}`,
          approved: Math.random() > 0.1,
          approvedBy: Math.random() > 0.1 ? `Supervisor-${Math.floor(Math.random() * 5) + 1}` : undefined,
          approvedAt: Math.random() > 0.1 ? new Date() : undefined
        },
        processingInfo: {
          processedBy: `Staff-${Math.floor(Math.random() * 10) + 1}`,
          processedAt: collectionDate,
          separationMethod: 'whole-blood',
          components: [],
          yield: {}
        },
        qualityControl: {
          visualInspection: {
            color: 'Normal',
            clarity: 'Clear',
            clots: false,
            hemolysis: false,
            lipemia: false
          },
          sterilitySeal: true,
          labelAccuracy: true,
          volumeAccuracy: true,
          checkedBy: `QC-${Math.floor(Math.random() * 5) + 1}`,
          checkedAt: collectionDate
        },
        createdAt: collectionDate,
        updatedAt: new Date()
      };
    });
  };

  const calculateStats = (units: BloodUnit[]): InventoryStats => {
    const availableUnits = units.filter(u => u.status === 'available').length;
    const now = new Date();
    const expiringSoon = units.filter(u => {
      const daysUntilExpiration = Math.ceil((u.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiration <= 7 && daysUntilExpiration >= 0;
    }).length;

    const totalAge = units.reduce((sum, unit) => {
      const ageInDays = Math.floor((now.getTime() - unit.collectionDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + ageInDays;
    }, 0);

    return {
      totalUnits: units.length,
      availableUnits,
      expiringSoon,
      lowStockAlerts: Math.floor(Math.random() * 5),
      averageAge: units.length > 0 ? Math.round(totalAge / units.length) : 0,
      turnoverRate: Math.random() * 0.3 + 0.1
    };
  };

  const applyFilters = (units: BloodUnit[], filters: InventoryFilters): BloodUnit[] => {
    return units.filter(unit => {
      if (filters.bloodTypes && !filters.bloodTypes.includes(unit.bloodType)) return false;
      if (filters.components && !filters.components.includes(unit.component)) return false;
      if (filters.status && !filters.status.includes(unit.status)) return false;
      if (filters.location && !unit.location.room.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return unit.id.toLowerCase().includes(query) || 
               unit.donorId.toLowerCase().includes(query) ||
               unit.location.room.toLowerCase().includes(query);
      }
      return true;
    });
  };

  const refreshInventory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUnits = generateMockUnits();
      const filteredUnits = applyFilters(mockUnits, filters);
      
      setUnits(filteredUnits);
      setStats(calculateStats(mockUnits));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const updateUnit = async (unitId: string, updates: Partial<BloodUnit>) => {
    try {
      setUnits(prev => prev.map(unit => 
        unit.id === unitId ? { ...unit, ...updates, updatedAt: new Date() } : unit
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update unit');
    }
  };

  const reserveUnit = async (unitId: string, reservedFor: string) => {
    await updateUnit(unitId, { status: 'reserved' });
  };

  const issueUnit = async (unitId: string, issuedTo: string) => {
    await updateUnit(unitId, { status: 'issued' });
  };

  const discardUnit = async (unitId: string, reason: string) => {
    await updateUnit(unitId, { status: 'discarded' });
  };

  React.useEffect(() => {
    refreshInventory();
  }, []);

  React.useEffect(() => {
    if (units.length > 0) {
      const mockUnits = generateMockUnits();
      const filteredUnits = applyFilters(mockUnits, filters);
      setUnits(filteredUnits);
    }
  }, [filters]);

  return {
    units,
    stats,
    loading,
    error,
    filters,
    setFilters,
    refreshInventory,
    updateUnit,
    reserveUnit,
    issueUnit,
    discardUnit
  };
};

export default useInventory;