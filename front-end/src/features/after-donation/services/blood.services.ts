import api from '../../../services/axios/api';

export interface BloodData {
  bloodCode: string;
  bloodType: string;
  rhFactor: string;
  isSharedBlood: boolean;
  quantity: string;
  bloodMatch: string;
}

export const getAllBlood = async (): Promise<BloodData[]> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: BloodData[];
  }>('/blood');
  return response.data.data;
};
