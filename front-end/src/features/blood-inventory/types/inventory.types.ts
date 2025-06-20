export interface BloodUnit {
  id: string;
  donationId: string;
  donorId: string;
  bloodType: BloodType;
  component: BloodComponent;
  volume: number; // in ml
  collectionDate: Date;
  expirationDate: Date;
  status: BloodUnitStatus;
  location: StorageLocation;
  testResults: BloodTestResults;
  processingInfo: ProcessingInfo;
  qualityControl: QualityControlInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface BloodTestResults {
  hiv: TestResult;
  hepatitisB: TestResult;
  hepatitisC: TestResult;
  syphilis: TestResult;
  htlv: TestResult;
  bloodTyping: BloodTypingResult;
  antibodyScreen: TestResult;
  hemoglobin: number;
  hematocrit: number;
  plateletCount: number;
  whiteBloodCellCount: number;
  testDate: Date;
  technician: string;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface TestResult {
  result: 'positive' | 'negative' | 'inconclusive' | 'pending';
  value?: string;
  normalRange?: string;
  notes?: string;
}

export interface BloodTypingResult {
  abo: 'A' | 'B' | 'AB' | 'O';
  rh: 'positive' | 'negative';
  antibodies: string[];
  crossMatchCompatible: boolean;
}

export interface ProcessingInfo {
  processedBy: string;
  processedAt: Date;
  separationMethod: 'whole-blood' | 'apheresis' | 'automated';
  components: ComponentInfo[];
  yield: {
    redCells?: number;
    plasma?: number;
    platelets?: number;
    cryoprecipitate?: number;
  };
}

export interface ComponentInfo {
  type: BloodComponent;
  volume: number;
  unitId: string;
  storageRequirements: StorageRequirements;
}

export interface StorageRequirements {
  temperature: {
    min: number;
    max: number;
    unit: 'celsius' | 'fahrenheit';
  };
  humidity?: {
    min: number;
    max: number;
  };
  specialConditions?: string[];
}

export interface QualityControlInfo {
  visualInspection: {
    color: string;
    clarity: string;
    clots: boolean;
    hemolysis: boolean;
    lipemia: boolean;
  };
  bacterialCulture?: TestResult;
  endotoxinTest?: TestResult;
  sterilitySeal: boolean;
  labelAccuracy: boolean;
  volumeAccuracy: boolean;
  checkedBy: string;
  checkedAt: Date;
}

export interface StorageLocation {
  facility: string;
  building: string;
  room: string;
  refrigerator: string;
  shelf: string;
  position: string;
  temperature: number;
  lastTemperatureCheck: Date;
}

export interface InventoryAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  bloodType?: BloodType;
  component?: BloodComponent;
  message: string;
  threshold?: number;
  currentLevel?: number;
  unitsAffected?: string[];
  createdAt: Date;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  actions: AlertAction[];
}

export interface AlertAction {
  id: string;
  type: 'notify' | 'order' | 'transfer' | 'discard' | 'test';
  description: string;
  assignedTo?: string;
  dueDate?: Date;
  completedAt?: Date;
  notes?: string;
}

export interface InventoryReport {
  id: string;
  type: ReportType;
  period: {
    startDate: Date;
    endDate: Date;
  };
  data: InventoryReportData;
  generatedBy: string;
  generatedAt: Date;
  format: 'pdf' | 'excel' | 'csv';
}

export interface InventoryReportData {
  summary: InventorySummary;
  byBloodType: BloodTypeInventory[];
  byComponent: ComponentInventory[];
  expirationReport: ExpirationData[];
  usageStatistics: UsageStats;
  wastageReport: WastageData[];
  qualityMetrics: QualityMetrics;
}

export interface InventorySummary {
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  expiredUnits: number;
  discardedUnits: number;
  totalVolume: number;
  averageAge: number;
}

export interface BloodTypeInventory {
  bloodType: BloodType;
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  daysOfSupply: number;
  reorderLevel: number;
  status: 'adequate' | 'low' | 'critical' | 'excess';
}

export interface ComponentInventory {
  component: BloodComponent;
  totalUnits: number;
  availableUnits: number;
  averageAge: number;
  expiringIn7Days: number;
  expiringIn3Days: number;
  expiringToday: number;
}

export interface ExpirationData {
  date: Date;
  unitsExpiring: number;
  estimatedWastage: number;
  bloodTypes: {
    [key in BloodType]: number;
  };
  components: {
    [key in BloodComponent]: number;
  };
}

export interface UsageStats {
  totalIssued: number;
  issuedByBloodType: {
    [key in BloodType]: number;
  };
  issuedByComponent: {
    [key in BloodComponent]: number;
  };
  averageDailyUsage: number;
  peakUsageDays: Date[];
  turnoverRate: number;
}

export interface WastageData {
  totalWasted: number;
  wastedByReason: {
    expired: number;
    contaminated: number;
    damaged: number;
    recalled: number;
    other: number;
  };
  wastedByBloodType: {
    [key in BloodType]: number;
  };
  wastageRate: number;
  costImpact: number;
}

export interface QualityMetrics {
  testPassRate: number;
  contaminationRate: number;
  hemolysisRate: number;
  averageProcessingTime: number;
  qualityIncidents: number;
  complianceScore: number;
}

export interface InventoryTransaction {
  id: string;
  type: TransactionType;
  bloodUnitId: string;
  fromLocation?: StorageLocation;
  toLocation?: StorageLocation;
  quantity: number;
  reason: string;
  performedBy: string;
  performedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
}

export interface StockLevel {
  bloodType: BloodType;
  component: BloodComponent;
  currentStock: number;
  minimumLevel: number;
  maximumLevel: number;
  reorderPoint: number;
  averageDailyUsage: number;
  daysOfSupply: number;
  status: StockStatus;
  lastUpdated: Date;
}

export interface TemperatureLog {
  id: string;
  locationId: string;
  temperature: number;
  humidity?: number;
  recordedAt: Date;
  recordedBy: string;
  deviceId: string;
  isWithinRange: boolean;
  alerts?: string[];
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type BloodComponent = 
  | 'whole-blood'
  | 'red-blood-cells'
  | 'plasma'
  | 'platelets'
  | 'cryoprecipitate'
  | 'fresh-frozen-plasma'
  | 'packed-red-cells'
  | 'platelet-concentrate'
  | 'granulocytes';

export type BloodUnitStatus = 
  | 'collected'
  | 'testing'
  | 'processing'
  | 'available'
  | 'reserved'
  | 'issued'
  | 'expired'
  | 'discarded'
  | 'quarantined'
  | 'recalled';

export type AlertType = 
  | 'low-stock'
  | 'critical-stock'
  | 'expiration'
  | 'temperature'
  | 'contamination'
  | 'equipment-failure'
  | 'quality-issue'
  | 'recall';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ReportType = 
  | 'daily-inventory'
  | 'weekly-summary'
  | 'monthly-report'
  | 'expiration-report'
  | 'usage-analysis'
  | 'wastage-report'
  | 'quality-report'
  | 'compliance-report';

export type TransactionType = 
  | 'received'
  | 'issued'
  | 'transferred'
  | 'discarded'
  | 'expired'
  | 'returned'
  | 'quarantined'
  | 'released';

export type StockStatus = 'adequate' | 'low' | 'critical' | 'excess' | 'out-of-stock';

export interface InventoryFilters {
  bloodTypes?: BloodType[];
  components?: BloodComponent[];
  status?: BloodUnitStatus[];
  expirationRange?: {
    from?: Date;
    to?: Date;
  };
  collectionRange?: {
    from?: Date;
    to?: Date;
  };
  location?: string;
  searchQuery?: string;
}

export interface InventoryStats {
  totalUnits: number;
  availableUnits: number;
  expiringSoon: number;
  lowStockAlerts: number;
  averageAge: number;
  turnoverRate: number;
}