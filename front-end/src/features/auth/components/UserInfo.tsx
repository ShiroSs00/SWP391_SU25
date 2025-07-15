import React from 'react';
import { useCurrentUser } from '../hooks/useAuth';

const UserInfo: React.FC = () => {
  const { currentUser, isLoggedIn, name, username, role } = useCurrentUser();

  if (!isLoggedIn) {
    return <div>Chưa đăng nhập</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Thông tin người dùng</h3>
      <div className="space-y-1">
        <p><strong>Tên:</strong> {name || 'Chưa có tên'}</p>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Role:</strong> {role}</p>
        <p><strong>Email:</strong> {currentUser?.email}</p>
        {currentUser?.phone && (
          <p><strong>Số điện thoại:</strong> {currentUser.phone}</p>
        )}
        {currentUser?.bloodType && (
          <p><strong>Nhóm máu:</strong> {currentUser.bloodType}</p>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
