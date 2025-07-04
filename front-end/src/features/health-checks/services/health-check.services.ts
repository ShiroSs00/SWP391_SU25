import api from "../../../services/axios/api";
import type { HealthCheckData } from "../types/health-check.types";

// Cập nhật health check
export const updateHealthCheck = async (donationRegistrationId: string, data: HealthCheckData) => {
  const response = await api.put(`/healthcheck/update/${donationRegistrationId}`, data);
  return response.data;
};

// Tạo health check mới
export const createHealthCheck = async (donationRegistrationId: string, data: HealthCheckData) => {
  const response = await api.post(`/healthcheck/create/${donationRegistrationId}`, data);
  return response.data;
};

// Lấy tất cả health checks
export const getAllHealthChecks = async () => {
  const response = await api.get("/healthcheck/getall");
  return response.data;
};

// Lấy health check theo registration ID
export const getHealthCheckByRegistration = async (registrationId: string) => {
  const response = await api.get(`/healthcheck/get-by-registration/${registrationId}`);
  return response.data;
};

// Xóa health check theo ID
export const deleteHealthCheck = async (id: string) => {
  const response = await api.delete(`/healthcheck/delete/${id}`);
  return response.data;
};

// Xóa nhiều health checks
export const deleteMultipleHealthChecks = async (ids: string[]) => {
  const response = await api.delete("/healthcheck/delete-multiple", {
    data: { ids }
  });
  return response.data;
};