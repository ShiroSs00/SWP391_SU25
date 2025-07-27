import React from 'react';
import { Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { BloodBag } from '../types/request-blood.types';

interface InventoryCheckerProps {
  bloodBags: BloodBag[];
  requiredBloodCode: string;
  requiredComponentId: string;
  requiredVolume: number | null; 
  onInventoryCheck: (result: InventoryCheckResult) => void;
}

export interface InventoryCheckResult {
  sufficient: boolean;
  availableVolume: number;
  compatibleBags: BloodBag[];
  expiringBags: BloodBag[];
  shortfall: number;
}

/**
 * INVENTORY CHECKER COMPONENT
 * 
 * Chức năng chính:
 * 1. Kiểm tra tồn kho máu có đủ cho yêu cầu không
 * 2. Tìm các túi máu tương thích
 * 3. Cảnh báo túi máu sắp hết hạn
 * 4. Tính toán thiếu hụt nếu không đủ
 * 
 * Flow hoạt động:
 * 1. Nhận danh sách blood bags từ API
 * 2. Filter theo bloodCode và componentId
 * 3. Kiểm tra expiry date và status
 * 4. Tính tổng volume available
 * 5. So sánh với required volume
 * 6. Trả về kết quả check
 */
export const InventoryChecker: React.FC<InventoryCheckerProps> = ({
  bloodBags,
  requiredBloodCode,
  requiredComponentId,
  requiredVolume,
  onInventoryCheck,
}) => {
  React.useEffect(() => {
    checkInventory();
  }, [bloodBags, requiredBloodCode, requiredComponentId, requiredVolume]);

  /**
   * INVENTORY CHECK LOGIC
   * Kiểm tra tồn kho và tính toán kết quả
   */
  const checkInventory = () => {
    // Filter túi máu tương thích
    const compatibleBags = bloodBags.filter(bag => 
      bag.bloodCode === requiredBloodCode &&
      bag.componentId === requiredComponentId &&
      bag.status === 'available' &&
      new Date(bag.expirationDate) > new Date()
    );

    // Tìm túi máu sắp hết hạn (trong vòng 7 ngày)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const expiringBags = compatibleBags.filter(bag =>
      new Date(bag.expirationDate) <= sevenDaysFromNow
    );

    // Tính tổng volume có sẵn
    const availableVolume = compatibleBags.reduce((total, bag) => total + bag.volume, 0);
    
    // Kiểm tra đủ hay không - Handle null case
    const requiredVol = requiredVolume || 0;
    const sufficient = availableVolume >= requiredVol;
    const shortfall = sufficient ? 0 : requiredVol - availableVolume;

    const result: InventoryCheckResult = {
      sufficient,
      availableVolume,
      compatibleBags,
      expiringBags,
      shortfall,
    };

    onInventoryCheck(result);
  };

  const compatibleBags = bloodBags.filter(bag => 
    bag.bloodCode === requiredBloodCode &&
    bag.componentId === requiredComponentId &&
    bag.status === 'available' &&
    new Date(bag.expirationDate) > new Date()
  );

  const availableVolume = compatibleBags.reduce((total, bag) => total + bag.volume, 0);
  const requiredVol = requiredVolume || 0; // Handle null case
  const sufficient = availableVolume >= requiredVol;

  // Early return if requiredVolume is null
  if (requiredVolume === null) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-800">Kiểm Tra Tồn Kho</h2>
        </div>
        
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Chưa có thông tin về lượng máu cần thiết</p>
          <p className="text-sm text-gray-500 mt-1">
            Vui lòng nhập lượng máu cần thiết để kiểm tra tồn kho
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-800">Kiểm Tra Tồn Kho</h2>
      </div>

      {/* Inventory Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        sufficient 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-3">
          {sufficient ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-500" />
          )}
          
          <div className="flex-1">
            <h3 className={`font-medium ${
              sufficient ? 'text-green-800' : 'text-red-800'
            }`}>
              {sufficient ? 'Đủ máu trong kho' : 'Không đủ máu trong kho'}
            </h3>
            
            <div className="text-sm mt-1">
              <span className={sufficient ? 'text-green-700' : 'text-red-700'}>
                Có sẵn: {availableVolume}ml
              </span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-gray-700">
                Cần: {requiredVolume}ml
              </span>
              {!sufficient && (
                <>
                  <span className="text-gray-500 mx-2">•</span>
                  <span className="text-red-700">
                    Thiếu: {requiredVolume - availableVolume}ml
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compatible Bags List */}
      {compatibleBags.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">
            Túi máu tương thích ({compatibleBags.length})
          </h4>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {compatibleBags.slice(0, 5).map((bag) => {
              const isExpiringSoon = new Date(bag.expirationDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
              
              return (
                <div key={bag.bagId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {bag.bloodCode} - {bag.componentId}
                      </p>
                      <p className="text-xs text-gray-600">
                        ID: {bag.bagId.slice(-8)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {bag.volume}ml
                    </p>
                    <div className="flex items-center gap-1">
                      {isExpiringSoon && (
                        <Clock className="w-3 h-3 text-orange-500" />
                      )}
                      <p className={`text-xs ${
                        isExpiringSoon ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        HSD: {new Date(bag.expirationDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {compatibleBags.length > 5 && (
              <p className="text-sm text-gray-600 text-center py-2">
                +{compatibleBags.length - 5} túi máu khác
              </p>
            )}
          </div>
        </div>
      )}

      {/* No Compatible Bags */}
      {compatibleBags.length === 0 && (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Không có túi máu tương thích</p>
          <p className="text-sm text-gray-500 mt-1">
            Cần tìm người hiến máu phù hợp
          </p>
        </div>
      )}
    </div>
  );
};