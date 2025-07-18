import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Search,
  UserCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import type { Donor } from '../types/request-blood.types';

interface DonorMatcherProps {
  recipientBloodCode: string;
  requiredVolume: number | null;
  shortfall: number;
  onFindDonors: (bloodCode: string) => Promise<Donor[]>;
  onContactDonor: (donor: Donor) => void;
}

/**
 * DONOR MATCHER COMPONENT
 * 
 * Chức năng chính:
 * 1. Tìm người hiến máu tương thích khi không đủ tồn kho
 * 2. Hiển thị danh sách donor phù hợp
 * 3. Cung cấp thông tin liên hệ donor
 * 4. Tính toán blood compatibility
 * 5. Sắp xếp donor theo độ ưu tiên
 * 
 * Flow hoạt động:
 * 1. Nhận bloodCode của người nhận
 * 2. Call API tìm compatible donors
 * 3. Filter theo eligibility và last donation date
 * 4. Sort theo priority (O- universal donor, recent donors)
 * 5. Hiển thị thông tin contact
 * 6. Cho phép staff liên hệ donor
 */
export const DonorMatcher: React.FC<DonorMatcherProps> = ({
  recipientBloodCode,
  requiredVolume,
  shortfall,
  onFindDonors,
  onContactDonor,
}) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonors, setSelectedDonors] = useState<Set<string>>(new Set());

  /**
   * BLOOD COMPATIBILITY MATRIX
   * Định nghĩa quy tắc tương thích nhóm máu
   */
  const getCompatibleDonorTypes = (recipientType: string): string[] => {
    const compatibilityMatrix: Record<string, string[]> = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-'],
    };
    
    return compatibilityMatrix[recipientType] || [];
  };

  /**
   * FIND COMPATIBLE DONORS
   * Tìm và load danh sách donor tương thích
   */
  const findCompatibleDonors = async () => {
    setLoading(true);
    try {
      const compatibleTypes = getCompatibleDonorTypes(recipientBloodCode);
      const allDonors: Donor[] = [];
      
      // Tìm donor cho từng blood type tương thích
      for (const bloodType of compatibleTypes) {
        const donorsForType = await onFindDonors(bloodType);
        allDonors.push(...donorsForType);
      }
      
      // Filter và sort donors
      const eligibleDonors = allDonors
        .filter(donor => donor.eligibleForDonation)
        .sort((a, b) => {
          // Ưu tiên O- (universal donor)
          if (a.bloodCode === 'O-' && b.bloodCode !== 'O-') return -1;
          if (b.bloodCode === 'O-' && a.bloodCode !== 'O-') return 1;
          
          // Ưu tiên donor hiến gần đây (có kinh nghiệm)
          const aLastDonation = a.lastDonationDate ? new Date(a.lastDonationDate).getTime() : 0;
          const bLastDonation = b.lastDonationDate ? new Date(b.lastDonationDate).getTime() : 0;
          
          return bLastDonation - aLastDonation;
        });
      
      setDonors(eligibleDonors);
    } catch (error) {
      console.error('Error finding donors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recipientBloodCode) {
      findCompatibleDonors();
    }
  }, [recipientBloodCode]);

  /**
   * FILTER DONORS BY SEARCH
   * Lọc donor theo từ khóa tìm kiếm
   */
  const filteredDonors = donors.filter(donor =>
    donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.bloodCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.phone.includes(searchTerm) ||
    (donor.address && donor.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  /**
   * HANDLE DONOR SELECTION
   * Xử lý chọn/bỏ chọn donor
   */
  const toggleDonorSelection = (donorId: string) => {
    const newSelected = new Set(selectedDonors);
    if (newSelected.has(donorId)) {
      newSelected.delete(donorId);
    } else {
      newSelected.add(donorId);
    }
    setSelectedDonors(newSelected);
  };

  /**
   * CONTACT SELECTED DONORS
   * Liên hệ với các donor đã chọn
   */
  const contactSelectedDonors = () => {
    const selectedDonorList = donors.filter(donor => selectedDonors.has(donor.id));
    selectedDonorList.forEach(donor => onContactDonor(donor));
  };

  /**
   * GET DONOR PRIORITY BADGE
   * Hiển thị badge ưu tiên cho donor
   */
  const getDonorPriorityBadge = (donor: Donor) => {
    if (donor.bloodCode === 'O-') {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
          Universal Donor
        </span>
      );
    }
    
    if (donor.bloodCode === recipientBloodCode) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          Exact Match
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
        Compatible
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Tìm Người Hiến Máu</h2>
            <p className="text-sm text-gray-600">
              Cần thêm {shortfall}ml máu {recipientBloodCode}
            </p>
          </div>
        </div>
        
        <button
          onClick={findCompatibleDonors}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Search className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Đang tìm...' : 'Tìm lại'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, nhóm máu, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Donors List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tìm người hiến phù hợp...</p>
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Không tìm thấy người hiến phù hợp</p>
          <p className="text-sm text-gray-500 mt-1">
            Thử mở rộng phạm vi tìm kiếm hoặc liên hệ ngân hàng máu khác
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className={`border rounded-lg p-4 transition-all ${
                selectedDonors.has(donor.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedDonors.has(donor.id)}
                    onChange={() => toggleDonorSelection(donor.id)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-800">{donor.name}</h3>
                      {getDonorPriorityBadge(donor)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        <span>Nhóm máu: <strong>{donor.bloodCode}</strong></span>
                      </div>
                      
                      {donor.lastDonationDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Hiến lần cuối: {new Date(donor.lastDonationDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${donor.phone}`} className="text-blue-600 hover:underline">
                          {donor.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${donor.email}`} className="text-blue-600 hover:underline">
                          {donor.email}
                        </a>
                      </div>
                    </div>
                    
                    {donor.address && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{donor.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <a
                    href={`tel:${donor.phone}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Gọi điện"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  
                  <a
                    href={`mailto:${donor.email}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Gửi email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact Selected Donors Button */}
      {selectedDonors.size > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">
                Đã chọn {selectedDonors.size} người hiến
              </p>
              <p className="text-sm text-blue-600">
                Hệ thống sẽ gửi thông báo đến các người hiến đã chọn
              </p>
            </div>
            
            <button
              onClick={contactSelectedDonors}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Liên hệ ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};