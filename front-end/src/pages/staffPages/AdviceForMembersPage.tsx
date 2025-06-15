import React, { useState } from 'react';
import { useAdviceForMembers } from '../../hooks/useAdviceForMembers';

const AdviceForMembersPage: React.FC = () => {
  const { sendAdvice, loading, error, success } = useAdviceForMembers();
  const [username, setUsername] = useState('');
  const [advice, setAdvice] = useState('');

  const handleSend = () => {
    sendAdvice(username, advice);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-red-600">Gửi lời khuyên cho thành viên</h2>
      <div className="mb-4">
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Tên đăng nhập"
          className="border p-2 mr-2 rounded w-1/2"
        />
        <input
          value={advice}
          onChange={e => setAdvice(e.target.value)}
          placeholder="Lời khuyên"
          className="border p-2 rounded w-1/2"
        />
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSend} disabled={loading}>
        Gửi
      </button>
      {success && <div className="text-green-600 mt-2">Đã gửi lời khuyên!</div>}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default AdviceForMembersPage; 