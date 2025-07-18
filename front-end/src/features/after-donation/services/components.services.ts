import api from '../../../services/axios/api';

export interface ComponentData {
  componentId: string;
  type: string;
  expirationDays: number;
  description: string;
  bloodBagId: string;
}

export const getAllComponents = async (): Promise<ComponentData[]> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: ComponentData[];
  }>('/components');
  return response.data.data;
};
