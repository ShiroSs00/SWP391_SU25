import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, User, MessageSquare, MapPin, ClipboardList } from 'lucide-react';

interface StaffFeatureMenuProps {
  isOpen: boolean;
}

const StaffFeatureMenu: React.FC<StaffFeatureMenuProps> = ({ isOpen }) => {
  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-red-800 text-white p-6 pt-20 overflow-y-auto shadow-lg z-20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <h1 className="text-xl font-bold mb-8 text-red-100">Chức năng Staff</h1>
      <ul className="space-y-4">
        <li>
          <Link to="/staff/donation-applications" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
            <FileText className="w-5 h-5" />
            <span className="text-base font-semibold">Quản lý đơn xin hiến máu</span>
          </Link>
        </li>
        <li>
          <Link to="/staff/blood-donation-info" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
            <User className="w-5 h-5" />
            <span className="text-base font-semibold">Quản lý thông tin hiến máu</span>
          </Link>
        </li>
        <li>
          <Link to="/staff/advice" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
            <MessageSquare className="w-5 h-5" />
            <span className="text-base font-semibold">Gửi lời khuyên cho thành viên</span>
          </Link>
        </li>
        <li>
          <Link to="/staff/search-blood-request" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
            <MapPin className="w-5 h-5" />
            <span className="text-base font-semibold">Tìm kiếm yêu cầu nhận máu</span>
          </Link>
        </li>
        <li>
          <Link to="/staff" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
            <ClipboardList className="w-5 h-5" />
            <span className="text-base font-semibold">Tổng quan Đơn hiến/nhận máu</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StaffFeatureMenu; 