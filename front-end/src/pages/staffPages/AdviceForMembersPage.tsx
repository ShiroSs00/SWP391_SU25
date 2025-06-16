import React, { useState, useEffect } from 'react';

interface Advice {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
}

const mockAdvice: Advice[] = [
  {
    id: 1,
    title: "Lợi ích của việc hiến máu thường xuyên",
    content: "Hiến máu không chỉ giúp người khác mà còn mang lại nhiều lợi ích sức khỏe cho người hiến như giảm nguy cơ mắc bệnh tim mạch, tăng cường sản xuất máu mới, và kiểm soát mức độ sắt trong cơ thể.",
    date: "2024-06-10",
    author: "Bác sĩ An",
  },
  {
    id: 2,
    title: "Những điều cần biết trước khi hiến máu",
    content: "Đảm bảo bạn đã ăn uống đầy đủ, ngủ đủ giấc, và không sử dụng rượu bia trong 24 giờ trước khi hiến máu. Mang theo giấy tờ tùy thân và cung cấp thông tin sức khỏe chính xác.",
    date: "2024-06-08",
    author: "Y tá Bình",
  },
  {
    id: 3,
    title: "Cách chăm sóc sau khi hiến máu",
    content: "Sau khi hiến máu, bạn nên nghỉ ngơi, uống nhiều nước, tránh các hoạt động thể lực nặng trong vài giờ đầu. Nếu cảm thấy chóng mặt, hãy nằm xuống và kê chân lên cao.",
    date: "2024-06-05",
    author: "Chuyên gia y tế",
  },
];

const AdviceForMembersPage: React.FC = () => {
  const [adviceList, setAdviceList] = useState<Advice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setAdviceList(mockAdvice);
      } catch (error) {
        console.error("Lỗi tải lời khuyên:", error);
        setError("Không thể tải lời khuyên.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdvice();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-700">Đang tải lời khuyên...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Lỗi: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Lời khuyên cho thành viên</h2>
      <p className="text-gray-700 mb-6">Cung cấp những lời khuyên hữu ích về hiến máu và sức khỏe cho các thành viên.</p>
      
      {adviceList.length === 0 ? (
        <p className="text-gray-600 text-center">Chưa có lời khuyên nào để hiển thị.</p>
      ) : (
        <div className="space-y-6">
          {adviceList.map((advice) => (
            <div key={advice.id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="text-xl font-semibold text-red-700 mb-2">{advice.title}</h3>
              <p className="text-gray-700 mb-3">{advice.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Ngày: {advice.date}</span>
                <span>Tác giả: {advice.author}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdviceForMembersPage; 