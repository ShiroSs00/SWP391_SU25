
import api from '../../../services/axios/api';
import type { AchievementApiResponse } from '../types/achievement-manage.types';

export const achievementManageService = {
  // Get all achievements
  getAllAchievements: async (): Promise<AchievementApiResponse> => {
    try {
      const response = await api.get<AchievementApiResponse>('/achievements/getall');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  }
};
