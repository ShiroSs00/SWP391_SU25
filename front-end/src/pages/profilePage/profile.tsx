import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Droplet, Pencil, Map, MessageCircle, Award, Clock } from 'lucide-react';

// Map bloodCode sang tên nhóm máu
const bloodTypeMap: Record<number, string> = {
  1: 'O+',
  2: 'A+',
  3: 'B+',
  4: 'AB+',
  5: 'O-',
  6: 'A-',
  7: 'B-',
  8: 'AB-',
};

interface ProfileType {
  profileId: number;
  accountId: string;
  name: string;
  phone: string;
  dob: string;
  gender: boolean;
  address: string;
  numberOfBloodDonation: number;
  achievementName: string;
  bloodCode: number;
  restDate: string;
  email: string;
  username: string;
  cover: string;
  avatar: string;
  friends: number;
  role: string;
}

const Profile: React.FC = () => {
  // Dữ liệu mẫu đồng bộ với DB
  const [profile] = useState<ProfileType>({
    profileId: 1,
    accountId: 'uuid-123',
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    dob: '1995-05-20',
    gender: true,
    address: '123 Đường ABC, Quận 1, TP.HCM',
    numberOfBloodDonation: 3,
    achievementName: 'Hiến máu tiêu biểu',
    bloodCode: 1,
    restDate: '2024-07-01',
    email: 'nguyenvana@email.com',
    username: 'nguyenvana',
    cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=cover&w=1200&q=80',
    avatar: '',
    friends: 419,
    role: 'user',
  });

  const [tab, setTab] = useState<'about' | 'history'>('about');

  // Dữ liệu mẫu lịch sử hiến máu (có feedback)
  const [donationHistory, setDonationHistory] = useState([
    {
      date: '2024-01-15',
      location: 'Bệnh viện Chợ Rẫy',
      volume: 350,
      note: 'Hiến máu nhân đạo',
      feedback: '',
    },
    {
      date: '2023-08-10',
      location: 'Bệnh viện 115',
      volume: 350,
      note: '',
      feedback: 'Nhân viên rất nhiệt tình!',
    },
    {
      date: '2022-12-05',
      location: 'Trường ĐH Y Dược',
      volume: 250,
      note: 'Chương trình Xuân Hồng',
      feedback: '',
    },
  ]);

  // State cho feedback
  const [feedbackIdx, setFeedbackIdx] = useState<number|null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleOpenFeedback = (idx: number) => {
    setFeedbackIdx(idx);
    setFeedbackText(donationHistory[idx].feedback || '');
  };

  const handleSaveFeedback = () => {
    if (feedbackIdx === null) return;
    setDonationHistory(prev => prev.map((item, idx) => idx === feedbackIdx ? { ...item, feedback: feedbackText } : item));
    setFeedbackIdx(null);
    setFeedbackText('');
  };

  const handleCancelFeedback = () => {
    setFeedbackIdx(null);
    setFeedbackText('');
  };

  const roleLabel = profile.role === 'admin' ? 'Quản trị viên' : profile.role === 'staff' ? 'Nhân viên' : 'Người dùng';
  const roleColor = profile.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : profile.role === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover + avatar + info */}
      <div className="relative w-full bg-white shadow">
        <div className="w-full h-64 sm:h-80 bg-gray-200 overflow-hidden">
          <img src={profile.cover} alt="cover" className="object-cover w-full h-full" />
        </div>
        {/* Avatar + info */}
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 px-4 sm:px-8 -mt-20 pb-4">
          <div className="relative">
            <div className="rounded-full bg-white p-2 shadow-lg border-4 border-white">
              {profile.avatar ? (
                <img src={profile.avatar} alt="avatar" className="w-36 h-36 rounded-full object-cover" />
              ) : (
                <User className="w-36 h-36 text-red-500" />
              )}
        </div>
      </div>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between w-full">
            <div>
              <div className="flex items-center gap-3 mb-1 mt-4 sm:mt-0">
                <span className="text-3xl font-extrabold text-gray-900">{profile.name}</span>
                <span className={`px-4 py-1 rounded-full text-base font-bold shadow ${roleColor}`}>{roleLabel}</span>
        </div>
              <div className="flex items-center gap-3 text-gray-500 text-base mb-2">
                <span>@{profile.username}</span>
        </div>
        </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-semibold shadow hover:bg-gray-300 transition flex items-center gap-2"><Pencil className="w-4 h-4" />Chỉnh sửa trang cá nhân</button>
        </div>
        </div>
        </div>
        {/* Tabs */}
        <div className="max-w-4xl mx-auto border-b border-gray-200 flex gap-2 px-4 sm:px-8">
          <button className={`py-3 px-4 font-semibold border-b-2 transition ${tab==='about' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-700 hover:text-blue-600'}`} onClick={()=>setTab('about')}>Giới thiệu</button>
          <button className={`py-3 px-4 font-semibold border-b-2 transition ${tab==='history' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-700 hover:text-blue-600'}`} onClick={()=>setTab('history')}>Lịch sử hiến máu</button>
        </div>
      </div>
      {/* Tab content */}
      <div className="max-w-4xl mx-auto mt-6 px-4 sm:px-8">
        {tab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Thông tin cá nhân</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700"><Mail className="w-5 h-5 mr-2 text-red-400" />{profile.email}</div>
                <div className="flex items-center text-gray-700"><Phone className="w-5 h-5 mr-2 text-blue-400" />{profile.phone}</div>
                <div className="flex items-center text-gray-700"><Calendar className="w-5 h-5 mr-2 text-green-400" />{profile.dob}</div>
                <div className="flex items-center text-gray-700"><span className="mr-2 font-bold text-purple-500">Giới tính:</span>{profile.gender ? 'Nam' : 'Nữ'}</div>
                <div className="flex items-center text-gray-700"><MapPin className="w-5 h-5 mr-2 text-cyan-400" />{profile.address}</div>
                <div className="flex items-center text-gray-700"><Award className="w-5 h-5 mr-2 text-yellow-500" />Danh hiệu: <span className="ml-1 font-semibold">{profile.achievementName || '-'}</span></div>
                <div className="flex items-center text-gray-700"><Clock className="w-5 h-5 mr-2 text-blue-500" />Ngày nghỉ tiếp theo: <span className="ml-1 font-semibold">{profile.restDate || '-'}</span></div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-6">
              <div className="flex items-center bg-white border border-red-200 rounded-lg px-4 py-3 shadow text-base">
                <Droplet className="h-6 w-6 text-red-500 mr-2" />
                <span className="text-gray-700 font-bold">Nhóm máu:</span>
                <span className="ml-2 px-3 py-1 rounded-full bg-red-100 text-red-600 font-extrabold text-base shadow">{bloodTypeMap[profile.bloodCode] || 'Không rõ'}</span>
              </div>
              <div className="flex items-center bg-white border border-yellow-200 rounded-lg px-4 py-3 shadow text-base">
                <span className="text-gray-700 font-bold mr-2">Số lần hiến máu:</span>
                <span className="ml-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-extrabold text-base shadow">{profile.numberOfBloodDonation}</span>
              </div>
            </div>
          </div>
        )}
        {tab === 'history' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2"><Map className="w-5 h-5" />Lịch sử hiến máu</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow border border-gray-100 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left font-bold text-gray-700">Ngày</th>
                    <th className="px-2 py-2 text-left font-bold text-gray-700">Địa điểm</th>
                    <th className="px-2 py-2 text-left font-bold text-gray-700">Số lượng (ml)</th>
                    <th className="px-2 py-2 text-left font-bold text-gray-700">Ghi chú</th>
                    <th className="px-2 py-2 text-left font-bold text-gray-700">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {donationHistory.map((item, idx) => (
                    <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-2 py-1 text-gray-800 whitespace-nowrap">{item.date}</td>
                      <td className="px-2 py-1 text-gray-800 whitespace-nowrap">{item.location}</td>
                      <td className="px-2 py-1 text-red-600 font-semibold whitespace-nowrap">{item.volume}</td>
                      <td className="px-2 py-1 text-gray-700">{item.note || '-'}</td>
                      <td className="px-2 py-1">
                        {item.feedback ? (
                          <div className="flex items-center gap-1 text-green-700">
                            <MessageCircle className="w-4 h-4" />
                            <span>{item.feedback}</span>
                          </div>
                        ) : (
                          <button
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold hover:bg-blue-200 transition"
                            onClick={() => handleOpenFeedback(idx)}
                          >
                            Feedback
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Modal feedback */}
            {feedbackIdx !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-md">
                  <h4 className="text-base font-bold mb-3 text-red-600 flex items-center gap-1"><MessageCircle className="w-5 h-5" />Feedback cho lần hiến máu</h4>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 text-gray-800 focus:ring-2 focus:ring-red-200 text-sm"
                    rows={3}
                    placeholder="Nhập cảm nghĩ, nhận xét hoặc đánh giá của bạn..."
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold"
                      onClick={handleCancelFeedback}
                    >
                      Hủy
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 text-xs"
                      onClick={handleSaveFeedback}
                    >
                      Lưu feedback
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;