import { NavigationMenu } from "../components/ui/navigation";
import Footer from "../components/layouts/Footer";
import { Card } from "../components/ui/card";
import { CardContent } from "../components/ui/card";
import { Heart, Users, Shield, Globe, ArrowRight, CheckCircle, Star } from "lucide-react";

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: "Tình yêu thương",
      description: "Chúng tôi tin rằng tình yêu thương là động lực lớn nhất để cứu giúp người khác.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "An toàn",
      description: "Đảm bảo quy trình hiến máu an toàn tuyệt đối cho cả người hiến và người nhận.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Cộng đồng",
      description: "Xây dựng cộng đồng người hiến máu tình nguyện mạnh mẽ và bền vững.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Globe,
      title: "Phục vụ",
      description: "Phục vụ cộng đồng với tâm huyết và trách nhiệm cao nhất.",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const milestones = [
    {
      year: "2009",
      title: "Thành lập tổ chức",
      description: "Bắt đầu hoạt động với sứ mệnh cứu sống những con người cần được giúp đỡ.",
      achievement: "Thành lập"
    },
    {
      year: "2012",
      title: "Mở rộng hoạt động",
      description: "Thiết lập mạng lưới các điểm hiến máu tại nhiều tỉnh thành trên cả nước.",
      achievement: "63 tỉnh thành"
    },
    {
      year: "2018",
      title: "Ứng dụng công nghệ",
      description: "Ra mắt hệ thống đăng ký hiến máu trực tuyến và ứng dụng di động.",
      achievement: "Số hóa hoàn toàn"
    },
    {
      year: "2024",
      title: "Thành tựu hiện tại",
      description: "Đã thu thập được hơn 50,000 đơn vị máu và cứu sống hàng nghìn người.",
      achievement: "50K+ đơn vị máu"
    }
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn An",
      role: "Người hiến máu 10 năm",
      quote: "Hiến máu không chỉ giúp người khác mà còn mang lại cho tôi cảm giác ý nghĩa về cuộc sống.",
      avatar: "🩸"
    },
    {
      name: "Trần Thị Bình",
      role: "Gia đình được cứu giúp",
      quote: "Nhờ có máu hiến tặng, con tôi đã được cứu sống. Tôi vô cùng biết ơn những người hiến máu.",
      avatar: "❤️"
    },
    {
      name: "Lê Minh Cường",
      role: "Tình nguyện viên",
      quote: "Tham gia vào công việc này làm tôi hiểu được giá trị của việc cho đi và chia sẻ.",
      avatar: "🤝"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <NavigationMenu />
      
      {/* Hero Section with Animation */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in">
              <span className="bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                Về Chúng Tôi
              </span>
            </h1>
            <p className="text-2xl md:text-3xl opacity-90 mb-8 animate-fade-in delay-300">
              Sứ mệnh cứu sống và lan tỏa tình yêu thương
            </p>
            <div className="flex flex-wrap justify-center gap-6 animate-fade-in delay-500">
              <div className="flex items-center bg-white/10 rounded-full px-6 py-3 backdrop-blur-sm">
                <Heart className="h-6 w-6 mr-2 text-red-200" />
                <span className="text-lg font-medium">15+ năm kinh nghiệm</span>
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-6 py-3 backdrop-blur-sm">
                <Users className="h-6 w-6 mr-2 text-red-200" />
                <span className="text-lg font-medium">25,000+ người hiến máu</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white">
            <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Mission Section with Enhanced Design */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  SỨ MỆNH CỦA CHÚNG TÔI
                </span>
                <h2 className="text-4xl font-bold text-[#222222] mb-6 leading-tight">
                  Kết nối những trái tim 
                  <span className="text-red-600"> nhân ái</span>
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <CheckCircle className="h-5 w-5 text-red-600 group-hover:text-white" />
                  </div>
                  <p className="text-lg text-[#222222] leading-relaxed">
                    Tạo ra một cộng đồng hiến máu tình nguyện mạnh mẽ, đảm bảo 
                    nguồn cung máu an toàn và đủ cho các nhu cầu y tế khẩn cấp.
                  </p>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <CheckCircle className="h-5 w-5 text-red-600 group-hover:text-white" />
                  </div>
                  <p className="text-lg text-[#222222] leading-relaxed">
                    Mỗi giọt máu hiến tặng không chỉ cứu sống một con người mà còn 
                    mang lại hy vọng cho cả gia đình họ.
                  </p>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <CheckCircle className="h-5 w-5 text-red-600 group-hover:text-white" />
                  </div>
                  <p className="text-lg text-[#222222] leading-relaxed">
                    Không ngừng nỗ lực để kết nối những trái tim nhân ái với những 
                    người cần được cứu giúp.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-8 shadow-xl">
                    <Heart className="h-12 w-12 text-white fill-current animate-pulse" />
                  </div>
                  <blockquote className="space-y-6">
                    <p className="text-2xl text-[#222222] font-medium leading-relaxed">
                      "Hiến máu là món quà vô giá nhất mà chúng ta có thể tặng cho nhau - 
                      món quà của sự sống."
                    </p>
                    <footer className="text-red-600 font-bold text-lg">
                      - Hiến Máu Nhân Đạo -
                    </footer>
                  </blockquote>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-200 rounded-full opacity-50 animate-bounce delay-1000"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-red-300 rounded-full opacity-30 animate-bounce delay-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section with Gradient Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              GIÁ TRỊ CỐT LÕI
            </span>
            <h2 className="text-4xl font-bold text-[#222222] mb-6">
              Những giá trị định hướng 
              <span className="text-red-600">mọi hoạt động</span>
            </h2>
            <p className="text-xl text-[#222222] max-w-3xl mx-auto">
              Chúng tôi xây dựng mọi hoạt động dựa trên những giá trị cốt lõi vững chắc
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardContent className="p-8 text-center relative">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${value.color} rounded-full mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#222222] mb-4 group-hover:text-red-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-[#222222] leading-relaxed">
                    {value.description}
                  </p>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="h-5 w-5 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section with Enhanced Design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              HÀNH TRÌNH PHÁT TRIỂN
            </span>
            <h2 className="text-4xl font-bold text-[#222222] mb-6">
              15 năm phát triển và 
              <span className="text-red-600">lan tỏa tình yêu thương</span>
            </h2>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-red-200 via-red-400 to-red-600 rounded-full"></div>
            
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} group`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg z-10 group-hover:scale-125 transition-transform duration-300"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 border-0 shadow-lg">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl font-bold text-red-600">{milestone.year}</span>
                          <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                            {milestone.achievement}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-[#222222] mb-4">
                          {milestone.title}
                        </h3>
                        <p className="text-[#222222] leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Empty space for alternating layout */}
                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              CẢM NHẬN TỪ CỘNG ĐỒNG
            </span>
            <h2 className="text-4xl font-bold text-[#222222] mb-6">
              Những chia sẻ 
              <span className="text-red-600">chân thành</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-[#222222] rounded-full flex items-center justify-center text-2xl mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#222222]">{testimonial.name}</h4>
                      <p className="text-[#222222] text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-[#222222] fill-[#222222]" />
                    ))}
                  </div>
                  <p className="text-[#222222] italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Animation */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Những Con Số Ấn Tượng
            </h2>
            <p className="text-xl opacity-90">
              Minh chứng cho 15 năm nỗ lực không ngừng
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 transform group-hover:scale-105">
                <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">50,000+</div>
                <div className="text-lg opacity-90">Đơn vị máu</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 transform group-hover:scale-105">
                <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">25,000+</div>
                <div className="text-lg opacity-90">Người hiến máu</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 transform group-hover:scale-105">
                <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">150,000+</div>
                <div className="text-lg opacity-90">Người được cứu</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 transform group-hover:scale-105">
                <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">63</div>
                <div className="text-lg opacity-90">Tỉnh thành</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;