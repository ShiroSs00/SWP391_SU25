import api from "../../../services/axios/api";
import type { HealthCheckData } from "../types/health-check.types";

// Cập nhật health check
export const updateHealthCheck = async (healthCheckId: string, data: HealthCheckData) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { healthCheckId: _, donationRegistrationId: __, ...requestData } = data;
  const response = await api.put(`/healthcheck/update/${healthCheckId}`, requestData);
  return response.data.data;
};

// Tạo health check mới
export const createHealthCheck = async (donationRegistrationId: string, data: HealthCheckData) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { donationRegistrationId: _, ...requestData } = data;
  const response = await api.post(`/healthcheck/create/${donationRegistrationId}`, requestData);
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