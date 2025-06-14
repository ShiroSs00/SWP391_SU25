import React, { useState, useEffect } from 'react';
import { useBloodDonationInfo } from '../../hooks/useBloodDonationInfo';

const BloodDonationInfoPage: React.FC = () => {
  const username = 'testuser'; // Thay bằng username thực tế khi tích hợp
  const { info, loading, error, updateInfo } = useBloodDonationInfo(username);
  const [editInfo, setEditInfo] = useState<any>(info);

  useEffect(() => {
    setEditInfo(info);
  }, [info]);

  if (loading) return <div>Đang tải thông tin hiến máu...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!info) return <div>Không có thông tin hiến máu.</div>;

  const handleSave = () => {
    updateInfo(editInfo);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-red-600">Quản lý thông tin hiến máu</h2>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Ghi chú</label>
        <input
          value={editInfo?.note || ''}
          onChange={e => setEditInfo({ ...editInfo, note: e.target.value })}
          className="border p-2 rounded w-full"
          placeholder="Ghi chú"
        />
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
        Lưu
      </button>
      {/* Hiển thị các trường khác nếu cần */}
    </div>
  );
};

export default BloodDonationInfoPage; 