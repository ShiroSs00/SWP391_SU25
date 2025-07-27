import api from '../../../services/axios/api';
import type { ApiResponse, AdminEvent } from '../types/admin.types';

/**
 * API FUNCTION: LẤY TẤT CẢ SỰ KIỆN
 * 
 * Endpoint: GET /api/event/getall
 * Mô tả: Lấy danh sách tất cả sự kiện từ database
 * Response: AdminEvent[] - Mảng các sự kiện
 * 
 * Error Handling:
 * - Network errors: NETWORK_ERROR
 * - Server errors: 500 status
 * - Not found: 404 status
 * - Invalid data: Validation errors
 * 
 * Sử dụng trong:
 * - EventsList component để hiển thị danh sách sự kiện
 * - EventTable component (admin) để quản lý sự kiện
 * - RegistrationPage để lấy thông tin sự kiện cụ thể
 */
export const getAllEvents = async (): Promise<AdminEvent[]> => {
  try {
    const res = await api.get<ApiResponse<AdminEvent[]>>('/event/getall');

    // VALIDATION: Kiểm tra response structure
    if (!res.data) {
      throw new Error('Không nhận được dữ liệu từ server');
    }
    
    if (!Array.isArray(res.data.data)) {
      throw new Error('Dữ liệu trả về không đúng định dạng');
    }

    return res.data.data;
  } catch (error: any) {
    // ENHANCED ERROR HANDLING
    if (error.code === 'ERR_NETWORK') {
      const networkError = new Error('Lỗi kết nối mạng');
      (networkError as any).code = 'NETWORK_ERROR';
      throw networkError;
    }
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error;
      
      switch (status) {
        case 404:
          throw new Error('Không tìm thấy dữ liệu sự kiện');
        case 500:
          throw new Error('Lỗi server nội bộ');
        case 403:
          throw new Error('Không có quyền truy cập');
        case 401:
          throw new Error('Phiên đăng nhập đã hết hạn');
        default:
          throw new Error(message || `Lỗi server (${status})`);
      }
    }
    
    // Re-throw the original error if it's already processed
    throw error;
  }
};

/**
 * API FUNCTION: TẠO SỰ KIỆN MỚI
 * 
 * Endpoint: POST /api/event/create
 * Mô tả: Tạo một sự kiện mới trong hệ thống
 * Body: Thông tin sự kiện cần tạo
 * Response: AdminEvent - Sự kiện vừa được tạo
 * 
 * Chỉ admin mới có quyền sử dụng function này
 */
export const createEvent = async (event: {
  nameOfEvent: string;
  startDate?: string;
  endDate?: string;
  expectedBloodVolume?: number;
  actualVolume?: number;
  location: string;
  status: string;
  accountId: string;
}): Promise<AdminEvent> => {
  const res = await api.post<AdminEvent>('/event/create', event);
  return res.data;
};

/**
 * API FUNCTION: CẬP NHẬT SỰ KIỆN
 * 
 * Endpoint: PUT /api/event/update/{id}
 * Mô tả: Cập nhật thông tin của một sự kiện đã tồn tại
 * Params: id - ID của sự kiện cần cập nhật
 * Body: Thông tin cần cập nhật (có thể partial)
 * Response: AdminEvent - Sự kiện sau khi cập nhật
 * 
 * Chỉ admin mới có quyền sử dụng function này
 */
export const updateEvent = async (
  id: string,
  event: {
    nameOfEvent?: string;
    startDate?: string;
    endDate?: string;
    expectedBloodVolume?: number;
    actualVolume?: number;
    location?: string;
    status?: string;
    accountId?: string;
  }
): Promise<AdminEvent> => {
  const res = await api.put<AdminEvent>(`/event/update/${id}`, event);
  return res.data;
};   

/**
 * API FUNCTION: XÓA SỰ KIỆN
 * 
 * Endpoint: DELETE /api/event/delete/{id}
 * Mô tả: Xóa một sự kiện khỏi hệ thống
 * Params: id - ID của sự kiện cần xóa
 * Response: void
 * 
 * Chỉ admin mới có quyền sử dụng function này
 */
export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/event/delete/${id}`);
};

/**
 * API FUNCTION: XÓA NHIỀU SỰ KIỆN
 * 
 * Endpoint: DELETE /api/event/delete-multiple
 * Mô tả: Xóa nhiều sự kiện cùng lúc
 * Body: Mảng các ID sự kiện cần xóa
 * Response: void
 * 
 * Chỉ admin mới có quyền sử dụng function này
 */
export const deleteMultipleEvents = async (ids: string[]): Promise<void> => {
  await api.delete(`/event/delete-multiple`, {
    data: ids,
  });
};

/**
 * API FUNCTION: LỌC SỰ KIỆN THEO KHOẢNG NGÀY KẾT THÚC
 * 
 * Endpoint: GET /api/event/by-end-date-range?from={from}&to={to}
 * Mô tả: Lấy các sự kiện có ngày kết thúc trong khoảng thời gian chỉ định
 * Query Params:
 * - from: Ngày bắt đầu (YYYY-MM-DD)
 * - to: Ngày kết thúc (YYYY-MM-DD)
 * Response: AdminEvent[] - Mảng các sự kiện phù hợp
 * 
 * Sử dụng trong EventTable component để lọc sự kiện theo ngày
 */
export const filterEventsByEndDateRange = async (from: string, to: string): Promise<AdminEvent[]> => {
  const res = await api.get<AdminEvent[]>(`/event/by-end-date-range?from=${from}&to=${to}`);
  return res.data;
};