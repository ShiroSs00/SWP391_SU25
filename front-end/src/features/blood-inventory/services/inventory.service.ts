import { 
  BloodUnit, 
  InventoryAlert, 
  InventoryReport, 
  InventoryTransaction,
  StockLevel,
  TemperatureLog,
  InventoryFilters 
} from '../types/inventory.types';

export class InventoryService {
  private static instance: InventoryService;
  private baseUrl = '/api/inventory';

  public static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  async getInventory(filters?: InventoryFilters): Promise<BloodUnit[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.bloodTypes) queryParams.append('bloodTypes', filters.bloodTypes.join(','));
      if (filters?.components) queryParams.append('components', filters.components.join(','));
      if (filters?.status) queryParams.append('status', filters.status.join(','));
      if (filters?.searchQuery) queryParams.append('search', filters.searchQuery);

      const response = await fetch(`${this.baseUrl}/units?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }

      return await response.json();
    } catch (error) {
      // Fallback to mock data for demo
      return this.mockGetInventory(filters);
    }
  }

  async getBloodUnit(unitId: string): Promise<BloodUnit> {
    try {
      const response = await fetch(`${this.baseUrl}/units/${unitId}`);
      
      if (!response.ok) {
        throw new Error('Blood unit not found');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch blood unit');
    }
  }

  async updateBloodUnit(unitId: string, updates: Partial<BloodUnit>): Promise<BloodUnit> {
    try {
      const response = await fetch(`${this.baseUrl}/units/${unitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update blood unit');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to update blood unit');
    }
  }

  async reserveBloodUnit(unitId: string, reservedFor: string, notes?: string): Promise<BloodUnit> {
    try {
      const response = await fetch(`${this.baseUrl}/units/${unitId}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservedFor, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to reserve blood unit');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to reserve blood unit');
    }
  }

  async issueBloodUnit(unitId: string, issuedTo: string, notes?: string): Promise<BloodUnit> {
    try {
      const response = await fetch(`${this.baseUrl}/units/${unitId}/issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issuedTo, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to issue blood unit');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to issue blood unit');
    }
  }

  async discardBloodUnit(unitId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/units/${unitId}/discard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to discard blood unit');
      }
    } catch (error) {
      throw new Error('Failed to discard blood unit');
    }
  }

  async getAlerts(): Promise<InventoryAlert[]> {
    try {
      const response = await fetch(`${this.baseUrl}/alerts`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      return await response.json();
    } catch (error) {
      // Fallback to mock data for demo
      return this.mockGetAlerts();
    }
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/alerts/${alertId}/acknowledge`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to acknowledge alert');
      }
    } catch (error) {
      throw new Error('Failed to acknowledge alert');
    }
  }

  async resolveAlert(alertId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/alerts/${alertId}/resolve`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to resolve alert');
      }
    } catch (error) {
      throw new Error('Failed to resolve alert');
    }
  }

  async getStockLevels(): Promise<StockLevel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/stock-levels`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock levels');
      }

      return await response.json();
    } catch (error) {
      return this.mockGetStockLevels();
    }
  }

  async getTemperatureLogs(locationId?: string, hours: number = 24): Promise<TemperatureLog[]> {
    try {
      const queryParams = new URLSearchParams();
      if (locationId) queryParams.append('locationId', locationId);
      queryParams.append('hours', hours.toString());

      const response = await fetch(`${this.baseUrl}/temperature-logs?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch temperature logs');
      }

      return await response.json();
    } catch (error) {
      return this.mockGetTemperatureLogs();
    }
  }

  async generateReport(type: string, startDate: Date, endDate: Date): Promise<InventoryReport> {
    try {
      const response = await fetch(`${this.baseUrl}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, startDate, endDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to generate report');
    }
  }

  async getTransactions(unitId?: string, limit: number = 50): Promise<InventoryTransaction[]> {
    try {
      const queryParams = new URLSearchParams();
      if (unitId) queryParams.append('unitId', unitId);
      queryParams.append('limit', limit.toString());

      const response = await fetch(`${this.baseUrl}/transactions?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      return await response.json();
    } catch (error) {
      return this.mockGetTransactions();
    }
  }

  // Mock methods for demo purposes
  private async mockGetInventory(filters?: InventoryFilters): Promise<BloodUnit[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock data
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const components = ['whole-blood', 'red-blood-cells', 'plasma', 'platelets'];
    const statuses = ['available', 'reserved', 'issued', 'testing'];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `BU${String(i + 1).padStart(6, '0')}`,
      donationId: `DON${String(i + 1).padStart(6, '0')}`,
      donorId: `DONOR${String(i + 1).padStart(4, '0')}`,
      bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)] as any,
      component: components[Math.floor(Math.random() * components.length)] as any,
      volume: 450 + Math.floor(Math.random() * 100),
      collectionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      expirationDate: new Date(Date.now() + Math.random() * 35 * 24 * 60 * 60 * 1000),
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
        testDate: new Date(),
        technician: `Tech-${Math.floor(Math.random() * 10) + 1}`,
        approved: Math.random() > 0.1
      },
      processingInfo: {
        processedBy: `Staff-${Math.floor(Math.random() * 10) + 1}`,
        processedAt: new Date(),
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
        checkedAt: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }

  private async mockGetAlerts(): Promise<InventoryAlert[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 'ALERT-001',
        type: 'low-stock',
        severity: 'high',
        bloodType: 'O-',
        message: 'Low stock alert for O- blood type. Current level: 3 units',
        threshold: 10,
        currentLevel: 3,
        unitsAffected: ['BU000001', 'BU000002', 'BU000003'],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actions: [
          {
            id: 'ACTION-001-1',
            type: 'notify',
            description: 'Notify blood bank supervisor',
            assignedTo: 'Supervisor-1'
          },
          {
            id: 'ACTION-001-2',
            type: 'order',
            description: 'Order emergency blood supply',
            assignedTo: 'Staff-1',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }
        ]
      }
    ];
  }

  private mockGetStockLevels(): StockLevel[] {
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const components = ['whole-blood', 'red-blood-cells', 'plasma', 'platelets'];
    
    return bloodTypes.flatMap(bloodType =>
      components.map(component => ({
        bloodType: bloodType as any,
        component: component as any,
        currentStock: Math.floor(Math.random() * 50) + 5,
        minimumLevel: 10,
        maximumLevel: 100,
        reorderPoint: 15,
        averageDailyUsage: Math.random() * 5 + 1,
        daysOfSupply: Math.floor(Math.random() * 20) + 5,
        status: ['adequate', 'low', 'critical'][Math.floor(Math.random() * 3)] as any,
        lastUpdated: new Date()
      }))
    );
  }

  private mockGetTemperatureLogs(): TemperatureLog[] {
    return Array.from({ length: 24 }, (_, i) => ({
      id: `TEMP-${i + 1}`,
      locationId: 'REF-001',
      temperature: 2 + Math.random() * 4,
      humidity: 60 + Math.random() * 20,
      recordedAt: new Date(Date.now() - i * 60 * 60 * 1000),
      recordedBy: 'System',
      deviceId: 'SENSOR-001',
      isWithinRange: Math.random() > 0.1,
      alerts: Math.random() > 0.9 ? ['Temperature out of range'] : undefined
    }));
  }

  private mockGetTransactions(): InventoryTransaction[] {
    const types = ['received', 'issued', 'transferred', 'discarded'];
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: `TXN-${String(i + 1).padStart(6, '0')}`,
      type: types[Math.floor(Math.random() * types.length)] as any,
      bloodUnitId: `BU${String(i + 1).padStart(6, '0')}`,
      quantity: 1,
      reason: 'Standard operation',
      performedBy: `Staff-${Math.floor(Math.random() * 10) + 1}`,
      performedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    }));
  }
}

export default InventoryService.getInstance();