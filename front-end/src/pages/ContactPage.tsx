import { NavigationMenu } from "../components/ui/navigation";
import Footer from "../components/layouts/Footer";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { MapPin, Phone, Mail, Clock, Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "../components/ui/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodType: "",
    message: "",
    donationType: "blood"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Đăng ký thành công!",
      description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      bloodType: "",
      message: "",
      donationType: "blood"
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      details: ["123 Đường ABC, Phường XYZ", "Quận 1, TP.HCM", "Việt Nam"]
    },
    {
      icon: Phone,
      title: "Điện thoại",
      details: ["Hotline: 0123 456 789", "Khẩn cấp: 115", "Hỗ trợ: 0987 654 321"]
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@hienmauvietnam.org", "support@hienmauvietnam.org", "emergency@hienmauvietnam.org"]
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      details: ["Thứ 2 - Thứ 6: 8:00 - 17:00", "Thứ 7: 8:00 - 12:00", "Khẩn cấp: 24/7"]
    }
  ];

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="min-h-screen bg-white">
      <NavigationMenu />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Hãy cùng chúng tôi cứu sống những con người cần được giúp đỡ
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-red-600">
                    <Heart className="h-6 w-6 mr-2 fill-current" />
                    Đăng Ký Hiến Máu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nhập họ và tên của bạn"
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0123 456 789"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-2">
                          Nhóm máu *
                        </label>
                        <select
                          id="bloodType"
                          name="bloodType"
                          required
                          value={formData.bloodType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Chọn nhóm máu</option>
                          {bloodTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="donationType" className="block text-sm font-medium text-gray-700 mb-2">
                          Loại hiến tặng
                        </label>
                        <select
                          id="donationType"
                          name="donationType"
                          value={formData.donationType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="blood">Hiến máu toàn phần</option>
                          <option value="platelets">Hiến tiểu cầu</option>
                          <option value="plasma">Hiến huyết tương</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Tin nhắn
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Có câu hỏi gì hoặc thông tin bổ sung..."
                        className="w-full"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3">
                      Đăng Ký Hiến Máu
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#222222] mb-6">
                  Thông Tin Liên Hệ
                </h2>
                <p className="text-[#222222] mb-8">
                  Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ với chúng tôi 
                  qua bất kỳ kênh nào dưới đây.
                </p>
              </div>

              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                            <info.icon className="h-6 w-6 text-red-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#222222] mb-2">
                            {info.title}
                          </h3>
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-[#222222]">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Emergency Contact */}
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Heart className="h-6 w-6 text-red-600 fill-current" />
                    <h3 className="text-lg font-semibold text-red-800">
                      Khẩn Cấp Cần Máu?
                    </h3>
                  </div>
                  <p className="text-red-700 mb-4">
                    Trong trường hợp khẩn cấp, vui lòng gọi ngay:
                  </p>
                  <div className="flex flex-col space-y-2">
                    <a href="tel:115" className="text-2xl font-bold text-red-600 hover:text-red-700">
                      115 (Cấp cứu)
                    </a>
                    <a href="tel:0123456789" className="text-xl font-semibold text-red-600 hover:text-red-700">
                      0123 456 789 (Hotline)
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#222222] mb-4">
              Vị Trí Của Chúng Tôi
            </h2>
            <p className="text-xl text-[#222222]">
              Tìm chúng tôi tại trung tâm thành phố
            </p>
          </div>
          <div className="bg-[#e5e5e5] h-96 rounded-lg flex items-center justify-center">
            <div className="text-center text-[#222222]">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-[#222222]" />
              <p className="text-lg text-[#222222]">Bản đồ sẽ được hiển thị tại đây</p>
              <p className="text-sm text-[#222222]">123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;