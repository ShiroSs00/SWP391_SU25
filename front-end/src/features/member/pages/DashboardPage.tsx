import type React from "react"
import {
  Heart,
  Calendar,
  Users,
  TrendingUp,
  Droplet,
  Star,
  MapPin,
  Bell,
  Activity,
  Target,
  User,
  Phone,
  Mail,
  Edit2,
  Camera,
} from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import type { DonationRecord } from "../types/dashboard.type"
import { Link } from "react-router-dom"
import type { ProfileData } from "../types/accounts.types"

interface DashboardPageProps {
  profile: ProfileData | null
  donationHistory: DonationRecord[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

const DashboardPage: React.FC<DashboardPageProps> = ({ profile, donationHistory, loading, error, onRetry }) => {
  // Helper functions để xử lý dữ liệu từ ProfileData
  const getGenderDisplay = (gender: boolean | undefined): string => {
    if (gender === undefined) return "Không xác định"
    return gender ? "Nam" : "Nữ"
  }

  const getAddressString = (address: ProfileData['address'] | undefined): string => {
    if (!address) return "Chưa cập nhật"
    if (typeof address === 'string') return address
    
    const parts = [address.street, address.ward, address.city, address.state].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : "Chưa cập nhật"
  }

  const formatDateOfBirth = (dob: string | undefined): string => {
    if (!dob) return "Chưa cập nhật"
    try {
      return new Date(dob).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return dob
    }
  }

  const getEmergencyNotificationStatus = (): boolean => {
    // Vì ProfileData không có emergencyNotifications, ta có thể suy ra từ isActive
    return profile?.isActive || false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <ErrorMessage message="Không thể tải thông tin người dùng" onRetry={onRetry} />
      </div>
    )
  }

  // Calculate statistics
  const completedDonations = donationHistory.filter((d) => d.status === "Completed" || d.status === "Success").length
  const totalVolume = donationHistory
    .filter((d) => d.status === "Completed" || d.status === "Success")
    .reduce((sum, d) => sum + (d.volumeToTake || 0), 0)
  const recentDonations = donationHistory.slice(0, 5)

  const getBloodTypeColor = (bloodType: string | undefined) => {
    if (!bloodType) return "bg-gray-100 text-gray-800 border-gray-200"
    
    const colors = {
      "A+": "bg-red-100 text-red-800 border-red-200",
      "A-": "bg-red-200 text-red-900 border-red-300",
      "B+": "bg-blue-100 text-blue-800 border-blue-200",
      "B-": "bg-blue-200 text-blue-900 border-blue-300",
      "AB+": "bg-purple-100 text-purple-800 border-purple-200",
      "AB-": "bg-purple-200 text-purple-900 border-purple-300",
      "O+": "bg-green-100 text-green-800 border-green-200",
      "O-": "bg-green-200 text-green-900 border-green-300",
    }
    return colors[bloodType as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const canDonateBlood = profile.restDate ? new Date(profile.restDate) <= new Date() : true
  const emergencyNotifications = getEmergencyNotificationStatus()

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={
                    profile.avatarUrl ||
                    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop"
                  }
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Chào mừng, {profile.name}!</h1>
                <p className="text-red-100 text-lg mb-3">Cảm ơn bạn đã là một người hùng hiến máu</p>
                <div className="flex items-center space-x-4">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getBloodTypeColor(profile.bloodType)}`}
                  >
                    <Droplet className="w-4 h-4 mr-1" />
                    {profile.bloodType || "Chưa xác định"}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${
                      canDonateBlood
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {canDonateBlood ? "Sẵn sàng hiến máu" : "Tạm hoãn"}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{profile.numberOfBloodDonation || completedDonations}</div>
              <div className="text-red-100">Lần hiến máu</div>
              <button className="mt-3 flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors">
                <Edit2 className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-red-500" />
              Thông tin cá nhân
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium text-gray-900">{profile.phone || "Chưa cập nhật"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p className="font-medium text-gray-900">{formatDateOfBirth(profile.dob)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <p className="font-medium text-gray-900">{getGenderDisplay(profile.gender)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="font-medium text-gray-900 text-sm">{getAddressString(profile.address)}</p>
                </div>
              </div>
            </div>

            {/* Health Status */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">Trạng thái sức khỏe</h4>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  canDonateBlood ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${canDonateBlood ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className={`font-medium ${canDonateBlood ? 'text-green-800' : 'text-yellow-800'}`}>
                      {canDonateBlood ? 'Sẵn sàng hiến máu' : 'Đang trong thời gian nghỉ'}
                    </span>
                  </div>
                  <span className={`text-sm ${canDonateBlood ? 'text-green-600' : 'text-yellow-600'}`}>
                    {canDonateBlood ? 'Tình trạng tốt' : profile.restDate ? `Đến ${formatDate(profile.restDate)}` : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-blue-800">Trạng thái tài khoản</span>
                  </div>
                  <span className="text-blue-600 text-sm">{profile.isActive ? "Đang hoạt động" : "Không hoạt động"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Tổng lần hiến</p>
                  <p className="text-3xl font-bold text-gray-800">{profile.numberOfBloodDonation || completedDonations}</p>
                  <p className="text-green-600 text-sm mt-1">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Hoạt động tích cực
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Nhóm máu</p>
                  <p className="text-3xl font-bold text-gray-800">{profile.bloodType || "Chưa xác định"}</p>
                  <p className="text-purple-600 text-sm mt-1">
                    {profile.achievementName || "Người hiến tâm huyết"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-500" />
                Hoạt động hiến máu gần đây
              </h3>
              <button className="text-red-500 hover:text-red-600 text-sm font-medium">Xem tất cả →</button>
            </div>

            {recentDonations.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có hoạt động hiến máu</p>
                <p className="text-gray-400 text-sm mt-2">Hãy tham gia hiến máu để tạo lịch sử đầu tiên!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Droplet className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800">
                          Hiến máu {donation.volume || donation.volumeToTake || 0}ml
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            donation.status === "Completed" || donation.status === "Success"
                              ? "bg-green-100 text-green-800"
                              : donation.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {donation.status === "Completed" || donation.status === "Success"
                            ? "Hoàn thành"
                            : donation.status === "Pending"
                              ? "Đang chờ"
                              : "Đã hủy"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(donation.date || donation.requestDate || '')}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {donation.location || "Chưa xác định"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              Hành động nhanh
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/donation" className="flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 group">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-red-800">Đăng ký hiến máu</p>
                  <p className="text-sm text-red-600">Tìm sự kiện gần bạn</p>
                </div>
              </Link>

              <Link to="/events" className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 group">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-blue-800">Sự kiện đang diễn ra</p>
                  <p className="text-sm text-blue-600">Cùng nhau đi hiến máu nào</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage