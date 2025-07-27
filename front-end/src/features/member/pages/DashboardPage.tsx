import type React from "react"
import {
  Heart,
  Calendar,
  Award,
  Users,
  TrendingUp,
  Droplet,
  Star,
  Clock,
  MapPin,
  Bell,
  Activity,
  Target,
} from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import type { DonationRecord, Achievement, EventParticipation } from "../types/dashboard.type"
import { useProfile } from "../hooks/useProfile" // Import the useProfile hook

interface DashboardPageProps {
  donationHistory: DonationRecord[]
  achievements: Achievement[]
  events: EventParticipation[]
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  donationHistory,
  achievements,
  events,
}) => {
  // Use the profile hook
  const { profile, loading, error } = useProfile()

  // Retry function for profile loading
  const handleRetry = () => {
    // Since useProfile doesn't expose a retry function, we can reload the page
    // or you can modify useProfile to return a refetch function
    window.location.reload()
  }

  // Debug logging
  console.log("DashboardPage state:", {
    profile: profile ? "loaded" : "null",
    donationHistoryCount: donationHistory?.length || 0,
    achievementsCount: achievements?.length || 0,
    eventsCount: events?.length || 0,
    loading,
    error,
  })

  console.log("Donation history data:", donationHistory)

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
        <ErrorMessage message={error} onRetry={handleRetry} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <ErrorMessage message="Không thể tải thông tin người dùng" onRetry={handleRetry} />
      </div>
    )
  }

  // Calculate statistics with better error handling
  const completedDonations =
    donationHistory?.filter(
      (d) => d.status === "Completed" || d.status === "Success" || d.status === "SEPARATED" || d.status === "PASSED",
    ) || []

  const totalVolume = completedDonations.reduce((sum, d) => {
    const volume = d.volumeToTake || d.volume || 0
    return sum + volume
  }, 0)

  const unlockedAchievements = achievements?.filter((a) => a.isUnlocked) || []
  const upcomingEvents = events?.filter((e) => e.status === "UPCOMING") || []
  const recentDonations = donationHistory?.slice(0, 3) || []
  const recentAchievements = unlockedAchievements.slice(0, 3)

  console.log("Calculated stats:", {
    completedDonationsCount: completedDonations.length,
    totalVolume,
    unlockedAchievementsCount: unlockedAchievements.length,
    upcomingEventsCount: upcomingEvents.length,
    recentDonationsCount: recentDonations.length,
  })

  const getBloodTypeColor = (bloodType: string) => {
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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={
                  profile.avatarUrl ||
                  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop"
                }
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại, {profile.name}!</h1>
                <p className="text-red-100 text-lg">Cảm ơn bạn đã là một người hùng hiến máu</p>
                <div className="flex items-center space-x-4 mt-3">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getBloodTypeColor(profile.bloodType)}`}
                  >
                    <Droplet className="w-4 h-4 mr-1" />
                    {profile.bloodType}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${
                      profile.isActive
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {profile.isActive ? "Sẵn sàng hiến máu" : "Tạm hoãn"}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{profile.numberOfBloodDonation || completedDonations.length}</div>
              <div className="text-red-100">Lần hiến máu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng lần hiến</p>
              <p className="text-3xl font-bold text-gray-800">{profile.numberOfBloodDonation || completedDonations.length}</p>
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

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Tổng thể tích</p>
              <p className="text-3xl font-bold text-gray-800">{totalVolume.toLocaleString()}</p>
              <p className="text-blue-600 text-sm mt-1">ml máu đã hiến</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Droplet className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Thành tích</p>
              <p className="text-3xl font-bold text-gray-800">{unlockedAchievements.length}</p>
              <p className="text-yellow-600 text-sm mt-1">đã mở khóa</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Sự kiện sắp tới</p>
              <p className="text-3xl font-bold text-gray-800">{upcomingEvents.length}</p>
              <p className="text-purple-600 text-sm mt-1">đang chờ tham gia</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-red-500" />
              Hoạt động gần đây
            </h3>
            <button className="text-red-500 hover:text-red-600 text-sm font-medium">Xem tất cả →</button>
          </div>

          {recentDonations.length === 0 && (!profile.recentActivities || profile.recentActivities.length === 0) ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có hoạt động hiến máu</p>
              <p className="text-gray-400 text-sm mt-1">Dữ liệu: {donationHistory?.length || 0} bản ghi tổng cộng</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Show recent activities from profile if available */}
              {profile.recentActivities && profile.recentActivities.length > 0 && (
                <>
                  {profile.recentActivities.slice(0, 2).map((activity, index) => (
                    <div
                      key={`activity-${index}`}
                      className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.description}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
              
              {/* Show donation history */}
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
                      <p className="font-medium text-gray-800">Hiến máu {donation.volume || donation.volumeToTake}ml</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          donation.status === "Completed" ||
                          donation.status === "Success" ||
                          donation.status === "SEPARATED" ||
                          donation.status === "PASSED"
                            ? "bg-green-100 text-green-800"
                            : donation.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {donation.status === "Completed" ||
                        donation.status === "Success" ||
                        donation.status === "SEPARATED" ||
                        donation.status === "PASSED"
                          ? "Hoàn thành"
                          : donation.status === "Pending"
                            ? "Đang chờ"
                            : donation.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(donation.date)}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {donation.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Thành tích mới nhất
            </h3>
            <button className="text-yellow-500 hover:text-yellow-600 text-sm font-medium">Xem tất cả →</button>
          </div>

          {recentAchievements.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có thành tích nào</p>
              <p className="text-gray-400 text-sm mt-1">Dữ liệu: {achievements?.length || 0} thành tích tổng cộng</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                >
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{achievement.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          achievement.tier === "Gold"
                            ? "bg-yellow-100 text-yellow-800"
                            : achievement.tier === "Silver"
                              ? "bg-gray-100 text-gray-800"
                              : achievement.tier === "Bronze"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {achievement.tier}
                      </span>
                      {achievement.dateUnlocked && (
                        <span className="text-xs text-gray-500">{formatDate(achievement.dateUnlocked)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-500" />
          Hành động nhanh
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 group">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-red-800">Đăng ký hiến máu</p>
              <p className="text-sm text-red-600">Tìm sự kiện gần bạn</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 group">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-blue-800">Xem sự kiện</p>
              <p className="text-sm text-blue-600">Khám phá các hoạt động</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200 group">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-green-800">Mời bạn bè</p>
              <p className="text-sm text-green-600">Chia sẻ tinh thần hiến máu</p>
            </div>
          </button>
        </div>
      </div>

      {/* Health Status & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-500" />
            Tình trạng sức khỏe
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">Sẵn sàng hiến máu</span>
              </div>
              <span className="text-green-600 text-sm">Tình trạng tốt</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-blue-800">Lần hiến gần nhất</span>
              </div>
              <span className="text-blue-600 text-sm">
                {profile.restDate ? formatDate(profile.restDate) : recentDonations.length > 0 ? formatDate(recentDonations[0].date) : "Chưa có"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3">
                <Droplet className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-purple-800">Nhóm máu</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getBloodTypeColor(profile.bloodType)}`}
              >
                {profile.bloodType}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-orange-500" />
            Thông báo & Nhắc nhở
          </h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Bell className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-orange-800">Thông báo khẩn cấp</p>
                <p className="text-sm text-orange-600 mt-1">
                  {profile.isActive ? "Đã bật - Bạn sẽ nhận thông báo khi có yêu cầu khẩn cấp" : "Đã tắt"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Nhắc nhở hiến máu</p>
                <p className="text-sm text-blue-600 mt-1">
                  Lần hiến tiếp theo có thể sau{" "}
                  {formatDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString())}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <Users className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Cộng đồng hiến máu</p>
                <p className="text-sm text-green-600 mt-1">
                  Tham gia nhóm hiến máu địa phương để kết nối với những người cùng chí hướng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage