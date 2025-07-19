export interface BloodBag {
  bagId: string;
  volume: number;
  collectedDate: string;
  expirationDate: string;
  status: string;
  componentId: string;
  quantity: number;
  bloodCode: string;
}

export interface BloodBagResponse {
  success: boolean;
  message: string;
  data: BloodBag[];
  errors?: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
}

export interface BloodBagApiResponse {
  success: boolean;
  message: string;
  data: BloodBag[];
}

export interface UpdateBloodBagRequest {
  bagId: string;
  volume: number;
  collectedDate: string;
  expirationDate: string;
  status: string;
  componentId: string;
  quantity: number;
  bloodCode: string;
}

export interface DeleteBloodBagResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
