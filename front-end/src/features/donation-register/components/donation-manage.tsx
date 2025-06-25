import React, { useEffect, useState } from 'react';
import {
  getAllDonations,
  filterDonations,
  updateDonation,
  deleteDonation,
  deleteMultipleDonations
} from '../hooks/useBloodDonation';
import type {
  DonationRegistrationDTO,
  DonationFilterParams,
  DonationUpdatePayload
} from '../types/donations-register.types';

// Quản lý đơn hiến máu: danh sách, tìm kiếm, cập nhật, xóa
const DonationManage: React.FC = () => {
  const [donations, setDonations] = useState<DonationRegistrationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<DonationFilterParams>({ username: '', eventId: '' });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [role, setRole] = useState<string>('');

  // Lấy role từ localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setRole(parsed.role || '');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    fetchAll();
  }, []);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Lấy tất cả đơn hiến máu
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllDonations();
      setDonations(data);
    } catch {
      setError('Không thể tải danh sách đơn hiến máu');
    } finally {
      setLoading(false);
    }
  };

  // Lọc đơn hiến máu
  const handleFilter = async (params: DonationFilterParams) => {
    setLoading(true);
    setError('');
    try {
      const data = await filterDonations(params);
      setDonations(data);
    } catch {
      setError('Lọc đơn thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái đơn
  const handleUpdate = async (id: string, payload: DonationUpdatePayload) => {
    setLoading(true);
    setError('');
    try {
      await updateDonation(id, payload);
      setToast({ msg: 'Đổi trạng thái thành công', type: 'success' });
      fetchAll();
    } catch {
      setError('Cập nhật đơn thất bại');
      setToast({ msg: 'Đổi trạng thái thất bại', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Xóa đơn
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await deleteDonation(id);
      setToast({ msg: 'Xóa đơn thành công', type: 'success' });
      fetchAll();
    } catch {
      setError('Xóa đơn thất bại');
      setToast({ msg: 'Xóa đơn thất bại', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Xóa nhiều đơn
  const handleDeleteMultiple = async (ids: string[]) => {
    setLoading(true);
    setError('');
    try {
      await deleteMultipleDonations(ids);
      setToast({ msg: 'Xóa đơn thành công', type: 'success' });
      fetchAll();
    } catch {
      setError('Xóa đơn thất bại');
      setToast({ msg: 'Xóa đơn thất bại', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // UI quản lý đơn hiến máu
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 animate-fade-in">
      <h2 className="text-2xl font-extrabold mb-6 text-[#b71c1c] tracking-tight animate-fade-in-down">Quản lý đơn hiến máu</h2>
      {/* Toast */}
      {toast && (
        <div className={`mb-4 px-4 py-2 rounded shadow text-white font-semibold animate-fade-in-up ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>{toast.msg}</div>
      )}
      {/* Filter */}
      <form
        className="flex flex-col md:flex-row gap-4 mb-6 items-end"
        onSubmit={e => {
          e.preventDefault();
          handleFilter(filter);
        }}
      >
        <input
          type="text"
          placeholder="Tìm theo username"
          className="border p-2 rounded w-full md:w-64"
          value={filter.username || ''}
          onChange={e => setFilter(f => ({ ...f, username: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Tìm theo mã sự kiện"
          className="border p-2 rounded w-full md:w-64"
          value={filter.eventId || ''}
          onChange={e => setFilter(f => ({ ...f, eventId: e.target.value }))}
        />
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-200"
        >
          Lọc
        </button>
        <button
          type="button"
          className="px-5 py-2 bg-gray-300 rounded-full font-medium hover:bg-gray-400 transition-all duration-200"
          onClick={() => {
            setFilter({ username: '', eventId: '' });
            fetchAll();
          }}
        >
          Xóa lọc
        </button>
      </form>
      {error && <div className="text-red-600 mb-4 animate-fade-in">{error}</div>}
      {selectedIds.length > 0 && (
        <div className="mb-4 flex gap-2 items-center">
          <span className="text-sm text-gray-700">Đã chọn {selectedIds.length} đơn</span>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-all duration-200"
            onClick={() => {
              if (role === 'ADMIN' || role === 'STAFF') {
                if (window.confirm('Bạn chắc chắn muốn xóa các đơn đã chọn?')) {
                  handleDeleteMultiple(selectedIds);
                  setSelectedIds([]);
                }
              } else {
                setToast({ msg: 'Bạn không có quyền xóa nhiều đơn!', type: 'error' });
              }
            }}
            disabled={role !== 'ADMIN' && role !== 'STAFF'}
          >
            Xóa các đơn đã chọn
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded-full font-medium hover:bg-gray-400 transition-all duration-200"
            onClick={() => setSelectedIds([])}
          >
            Bỏ chọn
          </button>
        </div>
      )}
      {loading ? (
        <div className="animate-pulse">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto animate-fade-in">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-100 text-base text-[#b71c1c]">
                <th className="px-4 py-2 border-b font-bold">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === donations.length && donations.length > 0}
                    onChange={e => {
                      if (e.target.checked) setSelectedIds(donations.map(d => d.registrationId));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th className="px-4 py-2 border-b font-bold">Mã đơn</th>
                <th className="px-4 py-2 border-b font-bold">Mã sự kiện</th>
                <th className="px-4 py-2 border-b font-bold">Mã tài khoản</th>
                <th className="px-4 py-2 border-b font-bold">Ngày tạo</th>
                <th className="px-4 py-2 border-b font-bold">Trạng thái</th>
                <th className="px-4 py-2 border-b font-bold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.registrationId} className="hover:bg-[#fff3f3] transition-all animate-fade-in-up">
                  <td className="px-4 py-2 border-b text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(d.registrationId)}
                      onChange={e => {
                        if (e.target.checked) setSelectedIds(ids => [...ids, d.registrationId]);
                        else setSelectedIds(ids => ids.filter(id => id !== d.registrationId));
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 border-b font-semibold">{d.registrationId}</td>
                  <td className="px-4 py-2 border-b">{d.eventId}</td>
                  <td className="px-4 py-2 border-b">{d.accountId}</td>
                  <td className="px-4 py-2 border-b">{new Date(d.dateCreated).toLocaleString()}</td>
                  <td className="px-4 py-2 border-b">{d.status}</td>
                  <td className="px-4 py-2 border-b text-center flex gap-2 justify-center">
                    <button
                      className="px-3 py-1 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-all animate-fade-in-up hover:scale-105"
                      onClick={() => {
                        if (role === 'ADMIN' || role === 'STAFF') {
                          if (window.confirm('Bạn muốn đổi trạng thái đơn này?')) {
                            handleUpdate(d.registrationId, { status: d.status === 'Đăng ký mới' ? 'Đã xác nhận' : 'Đăng ký mới' });
                          }
                        } else {
                          setToast({ msg: 'Bạn không có quyền đổi trạng thái!', type: 'error' });
                        }
                      }}
                      disabled={role !== 'ADMIN' && role !== 'STAFF'}
                    >
                      Đổi trạng thái
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all animate-fade-in-up hover:scale-105"
                      onClick={() => {
                        if (role === 'ADMIN' || role === 'STAFF') {
                          if (window.confirm('Bạn chắc chắn muốn xóa đơn này?')) {
                            handleDelete(d.registrationId);
                          }
                        } else {
                          setToast({ msg: 'Bạn không có quyền xóa đơn!', type: 'error' });
                        }
                      }}
                      disabled={role !== 'ADMIN' && role !== 'STAFF'}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DonationManage;
