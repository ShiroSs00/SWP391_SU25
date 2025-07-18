import api from "../../../services/axios/api";
import type { HealthCheckData } from "../types/health-check.types";

// Cập nhật health check
export const updateHealthCheck = async (healthCheckId: string, data: HealthCheckData) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { healthCheckId: _, donationRegistrationId: __, ...requestData } = data;
  
  // Handle volumeToTake - remove field entirely when null
  const finalData = { ...requestData };
  
  if (data.volumeToTake === null) {
    // Explicitly set to null for database update
    finalData.volumeToTake = 0;
  } else if (data.volumeToTake !== undefined) {
    finalData.volumeToTake = data.volumeToTake;
  }
  
  console.log('Sending update data:', finalData);
  console.log('Original volumeToTake:', data.volumeToTake);
  console.log('Final volumeToTake:', finalData.volumeToTake);
  
  const response = await api.put(`/healthcheck/update/${healthCheckId}`, finalData);
  return response.data.data;
};

// Tạo health check mới
export const createHealthCheck = async (donationRegistrationId: string, data: HealthCheckData) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { donationRegistrationId: _, ...requestData } = data;
  
  // Clean up undefined values and handle volumeToTake
  const finalData = { ...requestData };
  
  // If not fit to donate, set volumeToTake to 0
  if (!data.isFitToDonate) {
    finalData.volumeToTake = 0;
  } else if (data.volumeToTake === undefined || data.volumeToTake === null) {
    // If fit to donate but no volume selected, remove the field
    delete finalData.volumeToTake;
  }
  
  // Remove other undefined values
  Object.keys(finalData).forEach(key => {
    if (finalData[key as keyof typeof finalData] === undefined) {
      delete finalData[key as keyof typeof finalData];
    }
  });
  
  console.log('Sending create data:', finalData);
  console.log('Original data:', data);
  console.log('Final data:', finalData);
  
  const response = await api.post(`/healthcheck/create/${donationRegistrationId}`, finalData);
  return response.data.data;
};

// Lấy tất cả health checks
export const getAllHealthChecks = async () => {
  const response = await api.get("/healthcheck/getall");
  return response.data.data;
};

// Lấy health check theo registration ID
export const getHealthCheckByRegistration = async (registrationId: string) => {
  const response = await api.get(`/healthcheck/get-by-registration/${registrationId}`);
  return response.data.data;
};

// Xóa health check theo ID
export const deleteHealthCheck = async (id: string) => {
  const response = await api.delete(`/healthcheck/delete/${id}`);
  return response.data.data;
};

// Xóa nhiều health checks
export const deleteMultipleHealthChecks = async (ids: string[]) => {
  const response = await api.delete("/healthcheck/delete-multiple", {
    data: { ids }
  });
  return response.data.data;
};