import api from '../../../services/axios/api';
import type { BloodBagApiResponse, UpdateBloodBagRequest, DeleteBloodBagResponse } from '../types/blood-bags.types';

export const bloodBagsService = {
  // Lấy tất cả blood bags
  getAllBloodBags: async (): Promise<BloodBagApiResponse> => {
    try {
      const response = await api.get('/blood-bags/getall');
      return response.data;
    } catch (error) {
      console.error('Error fetching blood bags:', error);
      throw error;
    }
  },

  // Cập nhật blood bag
  updateBloodBag: async (bagId: string, data: Omit<UpdateBloodBagRequest, 'bagId'>): Promise<BloodBagApiResponse> => {
    try {
      const response = await api.put(`/blood-bags/update/${bagId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating blood bag ${bagId}:`, error);
      throw error;
    }
  },

  // Xóa nhiều blood bags
  deleteMultipleBloodBags: async (bagIds: string[]): Promise<DeleteBloodBagResponse> => {
    try {
      const response = await api.delete('/donation/delete-multiple', {
        data: bagIds
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting blood bags:', error);
      throw error;
    }
  }
};

export default bloodBagsService;
