import api from '../../../services/axios/api';
import type { BloodBag } from '../types/request-blood.types';

/**
 * BLOOD BAG (INVENTORY) API SERVICES
 *
 * Tích hợp với backend APIs cho blood bag inventory:
 * - GET /api/blood-bags/getall - Lấy tất cả blood bags trong kho
 * - PUT /api/blood-bags/update/{bagId} - Cập nhật blood bag
 * - POST /api/blood-bags/create - Tạo blood bag mới
 * - DELETE /api/blood-bags/delete/{bagId} - Xóa blood bag
 */


// Lấy tất cả blood bags trong kho
export const getAllBloodBags = async (): Promise<BloodBag[]> => {
  try {
    const response = await api.get('/blood-bags/getall', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching blood bags:', error);
    throw error;
  }
};

// Kiểm tra tồn kho cho blood code cụ thể
export const checkInventoryAvailability = async (bloodCode: string, requiredVolume: number) => {
  try {
    const allBags = await getAllBloodBags();

    // Lọc blood bags phù hợp (cùng blood code, available, chưa hết hạn)
    const availableBags = allBags.filter(bag =>
      bag.bloodCode === bloodCode &&
      bag.status === 'available' &&
      new Date(bag.expirationDate) > new Date() // Changed expiryDate to expirationDate
    );

    // Tính tổng volume có sẵn
    const totalAvailableVolume = availableBags.reduce((sum, bag) => sum + bag.volume, 0);

    return {
      isAvailable: totalAvailableVolume >= requiredVolume,
      availableVolume: totalAvailableVolume,
      availableBags: availableBags,
      shortfall: Math.max(0, requiredVolume - totalAvailableVolume)
    };
  } catch (error) {
    console.error('Error checking inventory:', error);
    throw error;
  }
};

// Cập nhật blood bag (reserve khi có yêu cầu)
export const updateBloodBag = async (bagId: string, updateData: Partial<BloodBag>) => {
  try {
    const response = await api.put(`/blood-bags/update/${bagId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating blood bag:', error);
    throw error;
  }
};

// Reserve blood bags cho yêu cầu
export const reserveBloodBags = async (bloodCode: string, requiredVolume: number, requestId: string) => {
  try {
    const inventory = await checkInventoryAvailability(bloodCode, requiredVolume);

    if (!inventory.isAvailable) {
      throw new Error(`Không đủ máu trong kho. Cần ${requiredVolume}ml, chỉ có ${inventory.availableVolume}ml`);
    }

    // Reserve các blood bags theo thứ tự ưu tiên (gần hết hạn trước)
    const sortedBags = inventory.availableBags.sort((a, b) =>
      new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime() // Changed expiryDate to expirationDate
    );

    let remainingVolume = requiredVolume;
    const reservedBags = [];

    for (const bag of sortedBags) {
      if (remainingVolume <= 0) break;

      const volumeToReserve = Math.min(bag.volume, remainingVolume);

      // Cập nhật status thành reserved
      await updateBloodBag(bag.bagId, {
        status: 'reserved',
        waitingListId: requestId
      });

      reservedBags.push({
        ...bag,
        reservedVolume: volumeToReserve
      });

      remainingVolume -= volumeToReserve;
    }

    return {
      success: true,
      reservedBags,
      totalReservedVolume: requiredVolume - remainingVolume
    };
  } catch (error) {
    console.error('Error reserving blood bags:', error);
    throw error;
  }
};
