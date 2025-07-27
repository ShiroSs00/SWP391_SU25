import { Card } from "../ui/card";
import { CalendarIcon, ShieldCheckIcon, DropletsIcon, HeartIcon, ArrowRightIcon, CheckCircleIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function ProcessSection() {
  const navigate = useNavigate()

  const processSteps = [
    {
      step: "01",
      title: "Đăng ký & Đặt lịch",
      description: "Tạo tài khoản, điền thông tin sức khỏe và đặt lịch hẹn hiến máu tại trung tâm gần nhất.",
      icon: CalendarIcon,
      details: [
        "Đăng ký tài khoản miễn phí",
        "Hoàn thiện hồ sơ sức khỏe",
        "Chọn địa điểm và thời gian phù hợp"
      ],
      color: "blue"
    },
    {
      step: "02",
      title: "Kiểm tra sức khỏe",
      description: "Bác sĩ sẽ kiểm tra sức khỏe tổng quát, đo huyết áp và xét nghiệm máu cơ bản.",
      icon: ShieldCheckIcon,
      details: [
        "Kiểm tra huyết áp, mạch",
        "Xét nghiệm máu nhanh",
        "Tư vấn từ bác sĩ chuyên khoa"
      ],
      color: "green"
    },
    {
      step: "03",
      title: "Hiến máu an toàn",
      description: "Quy trình hiến máu diễn ra an toàn với thiết bị y tế hiện đại và đội ngũ chuyên nghiệp.",
      icon: DropletsIcon,
      details: [
        "Thiết bị y tế vô trùng",
        "Quy trình chuẩn quốc tế",
        "Thời gian hiến: 8-10 phút"
      ],
      color: "red"
    },
    {
      step: "04",
      title: "Chăm sóc sau hiến",
      description: "Nghỉ ngơi, được chăm sóc chu đáo và nhận chứng nhận hiến máu điện tử.",
      icon: HeartIcon,
      details: [
        "Nghỉ ngơi 15-20 phút",
        "Được phục vụ đồ ăn nhẹ",
        "Nhận chứng nhận điện tử"
      ],
      color: "purple"
    },
  ]

  const requirements = [
    "Tuổi từ 18-60 (lần đầu), 18-65 (đã hiến trước đó)",
    "Cân nặng tối thiểu 45kg",
    "Sức khỏe tốt, không mắc bệnh truyền nhiễm",
    "Không uống rượu bia 24h trước khi hiến",
    "Đã ăn no và ngủ đủ giấc",
    "Khoảng cách giữa 2 lần hiến tối thiểu 12 tuần"
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-500",
          text: "text-blue-600",
          bgLight: "bg-blue-50",
          border: "border-blue-200"
        }
      case "green":
        return {
          bg: "bg-green-500",
          text: "text-green-600",
          bgLight: "bg-green-50",
          border: "border-green-200"
        }
      case "red":
        return {
          bg: "bg-red-500",
          text: "text-red-600",
          bgLight: "bg-red-50",
          border: "border-red-200"
        }
      case "purple":
        return {
          bg: "bg-purple-500",
          text: "text-purple-600",
          bgLight: "bg-purple-50",
          border: "border-purple-200"
        }
      default:
        return {
          bg: "bg-gray-500",
          text: "text-gray-600",
          bgLight: "bg-gray-50",
          border: "border-gray-200"
        }
    }
  }

  const handleStartDonationClick = () => {
    navigate("/donation")
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <DropletsIcon className="w-4 h-4 mr-2" />
            Quy trình hiến máu
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Quy trình hiến máu
            <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              an toàn & chuyên nghiệp
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Quy trình hiến máu được thực hiện theo tiêu chuẩn quốc tế, đảm bảo an toàn tuyệt đối cho người hiến và chất lượng máu thu được.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {processSteps.map((item, index) => {
            const colors = getColorClasses(item.color)
            const Icon = item.icon
            
            return (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0"></div>
                )}

                <Card className={`relative z-10 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${colors.border} hover:${colors.bgLight}`} padding="lg">
                  {/* Step Number */}
                  <div className={`w-16 h-16 mx-auto ${colors.bg} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 ${colors.bgLight} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>

                  {/* Details */}
                  <div className="space-y-2">
                    {item.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-600">
                        <CheckCircleIcon className={`w-3 h-3 ${colors.text} mr-2 flex-shrink-0`} />
                        {detail}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Requirements Section */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">Điều kiện hiến máu</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requirements.map((requirement, index) => (
              <Card key={index} className="flex items-center p-4 hover:shadow-md transition-shadow border border-gray-100">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-700">{requirement}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">Câu hỏi thường gặp</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-3">Hiến máu có đau không?</h4>
              <p className="text-sm text-gray-600">Bạn chỉ cảm thấy đau nhẹ khi kim tiêm đâm vào, sau đó không còn đau. Toàn bộ quá trình chỉ mất 8-10 phút.</p>
            </Card>
            
            <Card className="p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-3">Hiến máu có ảnh hưởng đến sức khỏe?</h4>
              <p className="text-sm text-gray-600">Không, cơ thể sẽ tự tái tạo máu trong vòng 24-48 giờ. Hiến máu còn giúp kích thích tạo máu mới, tốt cho sức khỏe.</p>
            </Card>
            
            <Card className="p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-3">Bao lâu có thể hiến máu một lần?</h4>
              <p className="text-sm text-gray-600">Khoảng cách tối thiểu giữa 2 lần hiến máu là 12 tuần (3 tháng) để cơ thể phục hồi hoàn toàn.</p>
            </Card>
            
            <Card className="p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-3">Có cần chuẩn bị gì trước khi hiến máu?</h4>
              <p className="text-sm text-gray-600">Ăn no, ngủ đủ giấc, uống nhiều nước, không uống rượu bia 24h trước và mang theo CMND/CCCD.</p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
            </div>

            <div className="relative z-10">
              <HeartIcon className="w-16 h-16 mx-auto mb-6 animate-pulse" />
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Bắt đầu hành trình hiến máu</h3>
              <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Tham gia cộng đồng hiến máu ngay hôm nay và trở thành người hùng thầm lặng cứu sống nhiều người.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleStartDonationClick}
                  className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  Bắt đầu hiến máu
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
                >
                  Tư vấn thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessSection