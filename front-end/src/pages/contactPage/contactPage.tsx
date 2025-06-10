import  React,{ useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, 3000);
    }, 1500);
  };

  // Load Google Maps
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 10.7769, lng: 106.7009 }, // Ho Chi Minh City coordinates
        zoom: 15,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ weight: "2.00" }]
          },
          {
            featureType: "all",
            elementType: "geometry.stroke",
            stylers: [{ color: "#9c9c9c" }]
          },
          {
            featureType: "all",
            elementType: "labels.text",
            stylers: [{ visibility: "on" }]
          }
        ]
      });

      // Add marker
      new window.google.maps.Marker({
        position: { lat: 10.7769, lng: 106.7009 },
        map: map,
        title: 'Blood Bank Vietnam',
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#dc2626" stroke="white" stroke-width="2"/>
              <path d="M20 8c-4.4 0-8 3.6-8 8 0 8 8 16 8 16s8-8 8-16c0-4.4-3.6-8-8-8z" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #dc2626;">Blood Bank Vietnam</h3>
            <p style="margin: 0; font-size: 14px;">123 Đường ABC, Quận 1<br>TP. Hồ Chí Minh</p>
          </div>
        `
      });

      // Show info window on marker click
      new window.google.maps.Marker({
        position: { lat: 10.7769, lng: 106.7009 },
        map: map,
      }).addListener('click', () => {
        infoWindow.open(map, marker);
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
      color: "text-blue-600"
    },
    {
      icon: Phone,
      title: "Điện thoại",
      content: "0123 456 789",
      link: "tel:0123456789",
      color: "text-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@bloodbank.vn",
      link: "mailto:info@bloodbank.vn",
      color: "text-red-600"
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 6: 8:00 - 17:00\nThứ 7 - Chủ nhật: 8:00 - 12:00",
      color: "text-purple-600"
    }
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Liên hệ với chúng tôi
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                Chúng tôi luôn sẵn sàng hỗ trợ và lắng nghe ý kiến từ bạn
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Thông tin liên hệ
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Hãy liên hệ với chúng tôi qua các kênh dưới đây. Chúng tôi cam kết phản hồi trong vòng 24 giờ.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                      <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-start space-x-4">
                          <div className={`${item.color} bg-gray-50 p-3 rounded-lg`}>
                            <IconComponent size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                            {item.link ? (
                                <a href={item.link} className={`${item.color} hover:underline`}>
                                  {item.content}
                                </a>
                            ) : (
                                <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
                            )}
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>

              {/* Google Maps */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MapPin className="mr-2 text-red-600" size={24} />
                    Vị trí của chúng tôi
                  </h3>
                </div>
                <div id="map" style={{ height: '400px', width: '100%' }}>
                  {/* Fallback content while Google Maps loads */}
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <div className="text-center">
                      <MapPin className="mx-auto mb-4 text-red-600" size={48} />
                      <p className="text-gray-600">Đang tải bản đồ...</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Thay thế YOUR_API_KEY bằng Google Maps API key thực tế
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Gửi tin nhắn
              </h2>

              {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
                    <h3 className="text-2xl font-semibold text-green-600 mb-2">
                      Gửi thành công!
                    </h3>
                    <p className="text-gray-600">
                      Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.
                    </p>
                  </div>
              ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập họ và tên"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                            placeholder="Nhập số điện thoại"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                          placeholder="Nhập địa chỉ email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chủ đề *
                      </label>
                      <select
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="donor">Thông tin về hiến máu</option>
                        <option value="request">Yêu cầu máu khẩn cấp</option>
                        <option value="general">Thắc mắc chung</option>
                        <option value="partnership">Hợp tác</option>
                        <option value="complaint">Khiếu nại</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung *
                      </label>
                      <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-vertical"
                          placeholder="Nhập nội dung tin nhắn..."
                      />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Đang gửi...
                          </>
                      ) : (
                          <>
                            <Send className="mr-2" size={20} />
                            Gửi tin nhắn
                          </>
                      )}
                    </button>
                  </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Câu hỏi thường gặp
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Làm thế nào để đăng ký hiến máu?</h3>
                <p className="text-gray-600">Bạn có thể đăng ký hiến máu qua website hoặc liên hệ trực tiếp với chúng tôi qua số điện thoại.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Điều kiện hiến máu là gì?</h3>
                <p className="text-gray-600">Tuổi từ 18-60, cân nặng tối thiểu 45kg, sức khỏe tốt và không mắc các bệnh truyền nhiễm.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tần suất hiến máu an toàn?</h3>
                <p className="text-gray-600">Nam giới có thể hiến máu 4 lần/năm, nữ giới 3 lần/năm, cách nhau ít nhất 12 tuần.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Có cần nhịn ăn trước khi hiến máu?</h3>
                <p className="text-gray-600">Không cần nhịn ăn, nên ăn nhẹ trước 2-3 tiếng và tránh thức ăn nhiều dầu mỡ.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Contact;