import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { HeartIcon, UserIcon, QuoteLeftIcon } from '@heroicons/react/24/outline';
import Card from '../ui/card/Card';
import Badge from '../ui/badge/Badge';

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Văn Minh',
      role: 'Người hiến máu tình nguyện',
      bloodType: 'O+',
      donationCount: 15,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Tôi đã hiến máu được 3 năm qua hệ thống BloodConnect. Quy trình rất chuyên nghiệp, an toàn và thuận tiện. Cảm giác được góp phần cứu sống người khác thật tuyệt vời.',
      rating: 5,
      date: '2024-01-10'
    },
    {
      id: 2,
      name: 'Trần Thị Lan',
      role: 'Bệnh nhân được truyền máu',
      bloodType: 'A-',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Khi con tôi gặp tai nạn và cần máu gấp, BloodConnect đã giúp chúng tôi tìm được người hiến máu phù hợp chỉ trong vòng 30 phút. Tôi vô cùng biết ơn!',
      rating: 5,
      date: '2024-01-08'
    },
    {
      id: 3,
      name: 'Lê Hoàng Nam',
      role: 'Bác sĩ tại BV Chợ Rẫy',
      bloodType: 'B+',
      donationCount: 8,
      avatar: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Là bác sĩ, tôi hiểu rõ tầm quan trọng của việc hiến máu. BloodConnect đã tạo ra một cầu nối hiệu quả giữa người hiến và người cần máu. Hệ thống rất đáng tin cậy.',
      rating: 5,
      date: '2024-01-05'
    },
    {
      id: 4,
      name: 'Phạm Thị Hoa',
      role: 'Người hiến máu lần đầu',
      bloodType: 'AB+',
      donationCount: 1,
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Ban đầu tôi rất lo lắng khi hiến máu lần đầu, nhưng đội ngũ y tế rất tận tình hướng dẫn. Giờ tôi đã hiểu hiến máu không đáng sợ và rất có ý nghĩa.',
      rating: 5,
      date: '2024-01-03'
    }
  ];

  const stats = {
    averageRating: 4.9,
    totalReviews: 2847,
    satisfaction: 98,
    referrals: 1250
  };

  return (
    <section className="py-24 bg-gradient-to-b from-dark-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blood-100 text-blood-700 text-sm font-medium mb-6">
            <HeartIcon className="w-4 h-4 mr-2" />
            Câu chuyện cảm động
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-6">
            Câu chuyện từ
            <span className="block bg-gradient-to-r from-blood-600 to-blood-800 bg-clip-text text-transparent">
              cộng đồng
            </span>
          </h2>
          
          <p className="text-xl text-dark-600 max-w-3xl mx-auto leading-relaxed">
            Những chia sẻ chân thực từ người hiến máu, bệnh nhân và đội ngũ y tế 
            về trải nghiệm với BloodConnect
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-dark-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
              ))}
            </div>
            <div className="text-2xl font-bold text-dark-900">{stats.averageRating}</div>
            <div className="text-sm text-dark-600">Đánh giá trung bình</div>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-dark-100 hover:shadow-xl transition-shadow">
            <div className="text-2xl font-bold text-blood-600 mb-1">{stats.totalReviews.toLocaleString()}</div>
            <div className="text-sm text-dark-600">Đánh giá tích cực</div>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-dark-100 hover:shadow-xl transition-shadow">
            <div className="text-2xl font-bold text-life-600 mb-1">{stats.satisfaction}%</div>
            <div className="text-sm text-dark-600">Hài lòng khách hàng</div>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-dark-100 hover:shadow-xl transition-shadow">
            <div className="text-2xl font-bold text-emergency-600 mb-1">{stats.referrals.toLocaleString()}</div>
            <div className="text-sm text-dark-600">Giới thiệu bạn bè</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              variant="default"
              padding="lg"
              hover
              className="group relative overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <QuoteLeftIcon className="w-12 h-12 text-blood-600" />
              </div>

              {/* Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-blood-100 group-hover:ring-blood-200 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-life-500 rounded-full flex items-center justify-center">
                    <HeartIcon className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-dark-900 text-lg">{testimonial.name}</h4>
                  <p className="text-dark-600 text-sm mb-2">{testimonial.role}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <blockquote className="text-dark-700 italic leading-relaxed mb-6 relative z-10">
                "{testimonial.content}"
              </blockquote>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-100">
                <div className="flex items-center space-x-3">
                  <Badge variant="blood" size="sm" rounded>
                    {testimonial.bloodType}
                  </Badge>
                  
                  {testimonial.donationCount && (
                    <Badge 
                      variant="success" 
                      size="sm" 
                      leftIcon={<HeartIcon className="w-3 h-3" />}
                    >
                      {testimonial.donationCount} lần hiến
                    </Badge>
                  )}
                </div>
                
                <span className="text-sm text-dark-500">
                  {new Date(testimonial.date).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center animate-slide-up">
          <div className="bg-gradient-to-r from-blood-600 to-blood-800 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">
                Chia sẻ câu chuyện của bạn
              </h3>
              <p className="text-xl text-blood-100 mb-8 max-w-2xl mx-auto">
                Hãy để câu chuyện hiến máu của bạn truyền cảm hứng cho nhiều người khác 
                tham gia vào hành trình cứu sống.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blood-600 px-8 py-4 rounded-xl font-semibold hover:bg-blood-50 transition-colors duration-200 transform hover:scale-105 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Chia sẻ câu chuyện
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blood-600 transition-all duration-200 transform hover:scale-105">
                  Xem thêm đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;