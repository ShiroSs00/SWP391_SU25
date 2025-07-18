import React, { useEffect, useState } from 'react';
import { getDonationsByAccountId } from '../services/accounts.services';
import type { DonationItem } from '../types/accounts.types';

const ProfileDonationHistory: React.FC<{ accountId: string }> = ({ accountId }) => {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getDonationsByAccountId(accountId);
        setDonations(
          data.map((item) => ({
            registrationId: item.registrationId,
            eventId: item.eventId,
            accountId: item.accountId,
            dateCreated: item.dateCreated,
            status: item.status,
          }))
        );
      } catch {
        setError('Không thể tải lịch sử hiến máu');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [accountId]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#b71c1c]">Lịch sử hiến máu</h2>
      {donations.length === 0 ? (
        <div className="text-gray-500">Không có lịch sử hiến máu.</div>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Mã đơn</th>
              <th className="border border-gray-300 px-4 py-2">Mã sự kiện</th>
              <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
              <th className="border border-gray-300 px-4 py-2">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((item) => (
              <tr key={item.registrationId} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.registrationId}</td>
                <td className="border border-gray-300 px-4 py-2">{item.eventId}</td>
                <td className="border border-gray-300 px-4 py-2">{item.status}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(item.dateCreated).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProfileDonationHistory;
