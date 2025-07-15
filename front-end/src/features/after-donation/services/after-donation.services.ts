import api from '../../../services/axios/api';
import type { AfterDonationData } from '../types/after-donation.types';

export const createAfterDonation = async (healthCheckId: string, data: AfterDonationData) => {
    const response = await api.post<{ data: AfterDonationData }>(`/after-donation/create/${healthCheckId}`, data);
    return response.data.data;
}
export const getAfterDonation = async () => {
    const response = await api.get('/after-donation/getall');
    return response.data.data;
}
export const updateAfterDonation = async (id: string, data: AfterDonationData) => {
    const response = await api.put<{ data: AfterDonationData }>(`/after-donation/update/${id}`, data);
    return response.data.data;
}
export const deleteAfterDonation = async (id: string) => {
    const response = await api.delete(`/after-donation/delete/${id}`);
    return response.data.data;
}
export const deleteMultipleAfterDonations = async (ids: string[]) => {
    const response = await api.delete('/after-donation/delete-multiple', {
        data: { ids }
    });
    return response.data.data;
}
export const separateAfterDonation = async (id: string) => {
    const response = await api.post<{ data: AfterDonationData }>(`/after-donation/manual-separate/${id}`);
    return response.data.data;
}