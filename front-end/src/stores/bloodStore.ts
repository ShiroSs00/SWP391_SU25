import { create } from 'zustand';
import { BloodTypeABO, BloodTypeRh, BloodComponentType, RequestPriority } from '../utils/enums';

export interface BloodType {
  abo: BloodTypeABO;
  rh: BloodTypeRh;
}

export interface BloodUnit {
  id: string;
  donorId: string;
  bloodType: BloodType;
  component: BloodComponentType;
  volume: number;
  collectionDate: string;
  expirationDate: string;
  status: 'available' | 'reserved' | 'used' | 'expired';
  location: string;
  testResults: {
    hiv: boolean;
    hepatitis: boolean;
    syphilis: boolean;
    approved: boolean;
  };
}

export interface BloodRequest {
  id: string;
  patientId: string;
  requestedBy: string;
  bloodType: BloodType;
  component: BloodComponentType;
  unitsNeeded: number;
  priority: RequestPriority;
  reason: string;
  hospitalId: string;
  status: 'pending' | 'matched' | 'fulfilled' | 'cancelled';
  requestDate: string;
  neededBy: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes?: string;
}

export interface DonorAvailability {
  id: string;
  donorId: string;
  bloodType: BloodType;
  availableDates: string[];
  preferredTimes: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
    maxDistance: number; // km
  };
  lastDonationDate?: string;
  nextEligibleDate: string;
  isEmergencyAvailable: boolean;
  contactPreferences: {
    phone: boolean;
    email: boolean;
    sms: boolean;
  };
}

export interface BloodInventory {
  bloodType: BloodType;
  component: BloodComponentType;
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  expiringIn7Days: number;
  expiringIn3Days: number;
  criticalLevel: number;
  lastUpdated: string;
}

interface BloodState {
  // Blood inventory
  inventory: BloodInventory[];
  
  // Blood requests
  activeRequests: BloodRequest[];
  emergencyRequests: BloodRequest[];
  
  // Donor availability
  availableDonors: DonorAvailability[];
  
  // Blood compatibility data
  compatibilityMatrix: Record<string, string[]>;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: {
    bloodType?: string;
    component?: BloodComponentType;
    location?: {
      latitude: number;
      longitude: number;
      radius: number;
    };
    priority?: RequestPriority;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

interface BloodActions {
  // Inventory management
  fetchInventory: () => Promise<void>;
  updateInventoryUnit: (unitId: string, updates: Partial<BloodUnit>) => Promise<void>;
  
  // Blood requests
  createBloodRequest: (request: Omit<BloodRequest, 'id' | 'requestDate' | 'status'>) => Promise<void>;
  updateBloodRequest: (requestId: string, updates: Partial<BloodRequest>) => Promise<void>;
  cancelBloodRequest: (requestId: string) => Promise<void>;
  fetchActiveRequests: () => Promise<void>;
  fetchEmergencyRequests: () => Promise<void>;
  
  // Donor availability
  registerDonorAvailability: (availability: Omit<DonorAvailability, 'id'>) => Promise<void>;
  updateDonorAvailability: (availabilityId: string, updates: Partial<DonorAvailability>) => Promise<void>;
  findCompatibleDonors: (bloodType: BloodType, component: BloodComponentType, location?: { lat: number; lng: number; radius: number }) => Promise<DonorAvailability[]>;
  
  // Blood matching
  findBloodMatches: (requestId: string) => Promise<{ donors: DonorAvailability[]; inventory: BloodUnit[] }>;
  
  // Compatibility
  checkCompatibility: (donorType: BloodType, recipientType: BloodType, component: BloodComponentType) => boolean;
  getCompatibleBloodTypes: (recipientType: BloodType, component: BloodComponentType) => string[];
  
  // Filters
  setFilters: (filters: Partial<BloodState['filters']>) => void;
  clearFilters: () => void;
  
  // Utility
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useBloodStore = create<BloodState & BloodActions>((set, get) => ({
  // Initial state
  inventory: [],
  activeRequests: [],
  emergencyRequests: [],
  availableDonors: [],
  compatibilityMatrix: {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
  },
  isLoading: false,
  error: null,
  filters: {},

  // Actions
  fetchInventory: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock inventory data
      const mockInventory: BloodInventory[] = [
        {
          bloodType: { abo: BloodTypeABO.O, rh: BloodTypeRh.NEGATIVE },
          component: BloodComponentType.WHOLE_BLOOD,
          totalUnits: 45,
          availableUnits: 12,
          reservedUnits: 8,
          expiringIn7Days: 5,
          expiringIn3Days: 2,
          criticalLevel: 10,
          lastUpdated: new Date().toISOString()
        },
        {
          bloodType: { abo: BloodTypeABO.O, rh: BloodTypeRh.POSITIVE },
          component: BloodComponentType.WHOLE_BLOOD,
          totalUnits: 120,
          availableUnits: 67,
          reservedUnits: 25,
          expiringIn7Days: 12,
          expiringIn3Days: 4,
          criticalLevel: 25,
          lastUpdated: new Date().toISOString()
        }
        // Add more mock data...
      ];
      
      set({ inventory: mockInventory, isLoading: false });
    } catch (error) {
      set({ error: 'Không thể tải dữ liệu kho máu', isLoading: false });
    }
  },

  createBloodRequest: async (request) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest: BloodRequest = {
        ...request,
        id: `req_${Date.now()}`,
        requestDate: new Date().toISOString(),
        status: 'pending'
      };
      
      set(state => ({
        activeRequests: [...state.activeRequests, newRequest],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Không thể tạo yêu cầu máu', isLoading: false });
    }
  },

  registerDonorAvailability: async (availability) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAvailability: DonorAvailability = {
        ...availability,
        id: `avail_${Date.now()}`
      };
      
      set(state => ({
        availableDonors: [...state.availableDonors, newAvailability],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Không thể đăng ký lịch hiến máu', isLoading: false });
    }
  },

  findCompatibleDonors: async (bloodType, component, location) => {
    const { availableDonors, compatibilityMatrix } = get();
    const bloodTypeString = `${bloodType.abo}${bloodType.rh}`;
    const compatibleTypes = compatibilityMatrix[bloodTypeString] || [];
    
    let compatibleDonors = availableDonors.filter(donor => {
      const donorTypeString = `${donor.bloodType.abo}${donor.bloodType.rh}`;
      return compatibleTypes.includes(donorTypeString);
    });
    
    // Filter by location if provided
    if (location) {
      compatibleDonors = compatibleDonors.filter(donor => {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          donor.location.latitude,
          donor.location.longitude
        );
        return distance <= location.radius;
      });
    }
    
    return compatibleDonors;
  },

  checkCompatibility: (donorType, recipientType, component) => {
    const { compatibilityMatrix } = get();
    const donorTypeString = `${donorType.abo}${donorType.rh}`;
    const recipientTypeString = `${recipientType.abo}${recipientType.rh}`;
    const compatibleTypes = compatibilityMatrix[donorTypeString] || [];
    
    return compatibleTypes.includes(recipientTypeString);
  },

  getCompatibleBloodTypes: (recipientType, component) => {
    const { compatibilityMatrix } = get();
    const recipientTypeString = `${recipientType.abo}${recipientType.rh}`;
    
    return Object.keys(compatibilityMatrix).filter(donorType => {
      const compatibleTypes = compatibilityMatrix[donorType];
      return compatibleTypes.includes(recipientTypeString);
    });
  },

  findBloodMatches: async (requestId) => {
    const { activeRequests, availableDonors, inventory } = get();
    const request = activeRequests.find(r => r.id === requestId);
    
    if (!request) {
      throw new Error('Không tìm thấy yêu cầu máu');
    }
    
    // Find compatible donors
    const compatibleDonors = await get().findCompatibleDonors(
      request.bloodType,
      request.component,
      {
        lat: request.location.latitude,
        lng: request.location.longitude,
        radius: 50 // 50km radius
      }
    );
    
    // Find compatible inventory units
    const compatibleInventory = inventory.filter(unit => 
      get().checkCompatibility(
        { abo: unit.bloodType.abo, rh: unit.bloodType.rh },
        request.bloodType,
        request.component
      ) && unit.status === 'available'
    );
    
    return {
      donors: compatibleDonors,
      inventory: compatibleInventory
    };
  },

  updateInventoryUnit: async (unitId, updates) => {
    // Mock implementation
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },

  updateBloodRequest: async (requestId, updates) => {
    set(state => ({
      activeRequests: state.activeRequests.map(request =>
        request.id === requestId ? { ...request, ...updates } : request
      )
    }));
  },

  cancelBloodRequest: async (requestId) => {
    set(state => ({
      activeRequests: state.activeRequests.filter(request => request.id !== requestId)
    }));
  },

  fetchActiveRequests: async () => {
    set({ isLoading: true });
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isLoading: false });
  },

  fetchEmergencyRequests: async () => {
    set({ isLoading: true });
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isLoading: false });
  },

  updateDonorAvailability: async (availabilityId, updates) => {
    set(state => ({
      availableDonors: state.availableDonors.map(donor =>
        donor.id === availabilityId ? { ...donor, ...updates } : donor
      )
    }));
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearFilters: () => set({ filters: {} }),
  clearError: () => set({ error: null }),
  setLoading: (loading) => set({ isLoading: loading })
}));

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
