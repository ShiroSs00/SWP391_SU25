import React, { useState } from "react";
import WrapperSection from "../../components/sections/wrapperSection.tsx";
import GroupedHeading from "../../components/sections/GroupedHeading.tsx";

const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Bạn có thể xử lý gửi form ở đây (gửi API, v.v.)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WrapperSection>
        <div className="max-w-2xl mx-auto py-8">
          <GroupedHeading
            title="Liên hệ"
            description="Gửi thắc mắc hoặc góp ý cho chúng tôi"
          />
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Thông tin liên hệ</h2>
            <p className="mb-2">Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
            <p className="mb-2">Email: <a href="mailto:info@bloodbank.vn" className="text-blue-600">info@bloodbank.vn</a></p>
            <p className="mb-6">Điện thoại: <a href="tel:0123456789" className="text-blue-600">0123 456 789</a></p>
            <hr className="my-6" />
            <h3 className="text-lg font-semibold mb-2">Gửi tin nhắn cho chúng tôi</h3>
            {submitted ? (
              <div className="text-green-600 font-semibold py-4">Cảm ơn bạn đã liên hệ!</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Nội dung</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                >
                  Gửi liên hệ
                </button>
              </form>
            )}
          </div>
        </div>
      </WrapperSection>
    </div>
  );
};

export default Contact;