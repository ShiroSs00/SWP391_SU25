import api from '../../../services/axios/api';
import type { UserProfile } from '../types/request-blood.types';

export const getProfile = async (token: string): Promise<UserProfile> => {
    const response = await api.get("/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log("API Response:", response.data);
    return response.data.data; 
};