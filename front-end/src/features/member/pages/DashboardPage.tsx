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
  Award,
  Trophy,
  Gift,
} from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import type { DonationRecord } from "../types/dashboard.type"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { type ProfileData } from "../types/accounts.types"
import { getProfile, getDonationsByAccountId } from "../services/accounts.services"
import { type Achievement } from "../types/dashboard.type"

interface DashboardPageProps {
  profile: ProfileData | null
  donationHistory: DonationRecord[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

const DashboardPage: React.FC<DashboardPageProps> = ({ profile: initialProfile, donationHistory: initialDonationHistory, loading: initialLoading, error: initialError, onRetry }) => {
  const [profile, setProfile] = useState<ProfileData | null>(initialProfile);
  const [donationHistory, setDonationHistory] = useState<DonationRecord[]>(initialDonationHistory);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(initialError);

  // Tạo achievements từ profile data
  const getAchievementsFromProfile = (profileData: ProfileData | null): Achievement[] => {
    if (!profileData?.achievementName) {
      return [];
    }

    return [{
      // Required properties from Achievement interface
      id: "achievement-1",
      title: profileData.achievementName || "First Blood Donation",
      description: "Chúc mừng bạn đã hoàn thành lần hiến máu đầu tiên!",
      icon: profileData.achievementName || "🩸",
      tier: 'Bronze' as const,
      isUnlocked: true,
      progress: profileData.numberOfBloodDonation || 0,
      maxProgress: 1,
      dateUnlocked: profileData.creationDate || new Date().toISOString(),

      // Optional API fields (keeping your original data)
      achievementId: "achievement-1",
      achievementName: profileData.achievementName,
      achieved: true,
      minValue: 1,
      maxValue: 1,
      currentValue: profileData.numberOfBloodDonation || 0,
    }];
  };

  const achievements = getAchievementsFromProfile(profile);

  // Fetch fresh data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get token from localStorage
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Không tìm thấy token đăng nhập');
        }

        // Fetch profile data using accounts service
        const profileData = await getProfile(token);
        console.log('Fresh profile data:', profileData);
        setProfile(profileData);

        // Fetch donations if we have accountId
        if (profileData?.accountId) {
          try {
            const donationsData = await getDonationsByAccountId(profileData.accountId);
            console.log('Fresh donations data:', donationsData);

            // Transform donations data to match DonationRecord interface
            const transformedDonations = donationsData.map((donation: any) => ({
              id: donation.registrationId || donation.id,
              name: donation.name || 'Hiến máu',
              event: donation.event || donation.eventName || '',
              bloodCode: donation.bloodCode || '',
              healthCheck: donation.healthCheck || '',
              afterDonationBlood: donation.afterDonationBlood || '',
              status: donation.status || 'Pending',
              type: 'donation' as const,
              registerId: donation.registrationId || donation.id,
              date: donation.dateCreated || new Date().toISOString(),
              location: donation.location || 'Không xác định',
              volume: donation.volume || 350,
              volumeToTake: donation.volumeToTake || donation.volume || 350,
            }));

            setDonationHistory(transformedDonations);
          } catch (donationError) {
            console.error('Error fetching donations:', donationError);
            // Don't fail the whole dashboard if donations fail
            setDonationHistory([]);
          }
        }

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't have initial data or if explicitly retrying
    if (!initialProfile || !initialDonationHistory) {
      fetchDashboardData();
    }
  }, [initialProfile, initialDonationHistory]);

  // Retry function that refetches all data
  const handleRetry = () => {
    setProfile(null);
    setDonationHistory([]);
    onRetry();
  };

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

  // Get blood type from profile data
  const getBloodType = () => {
    return profile.bloodType || "Chưa xác định";
  };

  // Calculate total donations from donation history or profile
  const getTotalDonations = () => {
    if (donationHistory && donationHistory.length > 0) {
      return donationHistory.filter((d) =>
        d.status === "Completed" ||
        d.status === "Success" ||
        d.status === "COMPLETED" ||
        d.status === "SUCCESS"
      ).length;
    }

    return profile.numberOfBloodDonation || 0;
  };

  // Calculate statistics
  const completedDonations = getTotalDonations();
  const totalVolume = donationHistory && donationHistory.length > 0
    ? donationHistory
      .filter((d) => d.status === "Completed" || d.status === "Success" || d.status === "COMPLETED" || d.status === "SUCCESS")
      .reduce((sum, d) => sum + (d.volumeToTake || d.volume || 350), 0)
    : completedDonations * 350;

  const recentDonations = donationHistory ? donationHistory.slice(0, 5) : [];
  const bloodType = getBloodType();

  // Get recent and unlocked achievements from profile
  const unlockedAchievements = achievements.filter(a => a.achieved);
  const recentAchievements = unlockedAchievements.slice(0, 3);

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

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'SUCCESS':
        return 'Hoàn thành';
      case 'PENDING':
        return 'Đang chờ';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'FAILED':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAchievementIcon = (achievementName: string) => {
    if (achievementName?.toLowerCase().includes('first') || achievementName?.toLowerCase().includes('đầu')) return Heart;
    if (achievementName?.toLowerCase().includes('event') || achievementName?.toLowerCase().includes('sự kiện')) return Calendar;
    if (achievementName?.toLowerCase().includes('donation') || achievementName?.toLowerCase().includes('hiến')) return Droplet;
    if (achievementName?.toLowerCase().includes('hero') || achievementName?.toLowerCase().includes('anh hùng')) return Star;
    return Award;
  };

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
                  alt={profile.name || profile.username}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Chào mừng, {profile.name || profile.username}!</h1>
                <p className="text-red-100 text-lg mb-3">Cảm ơn bạn đã là một người hùng hiến máu</p>
                <div className="flex items-center space-x-4">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getBloodTypeColor(bloodType)}`}
                  >
                    <Droplet className="w-4 h-4 mr-1" />
                    {bloodType}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${profile.isActive
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
              <div className="text-4xl font-bold mb-1">{completedDonations}</div>
              <div className="text-red-100">Lần hiến máu</div>
              <div className="text-sm text-red-200 mt-1">
                {totalVolume > 0 && `≈ ${totalVolume.toLocaleString()}ml tổng cộng`}
              </div>
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

              {profile.phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium text-gray-900">{profile.phone}</p>
                  </div>
                </div>
              )}

              {profile.dob && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày sinh</p>
                    <p className="font-medium text-gray-900">{formatDate(profile.dob)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <p className="font-medium text-gray-900">
                    {profile.gender ? "Nam" : "Nữ"}
                  </p>
                </div>
              </div>

              {profile.address && (
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {typeof profile.address === 'string' ?
                        profile.address :
                        `${profile.address?.street || ""}, ${profile.address?.ward || ""}, ${profile.address?.city || ""}, ${profile.address?.state || ""}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, '') || "N/A"
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Health Status */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">Trạng thái sức khỏe</h4>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 rounded-lg border ${profile.isActive
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                  }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${profile.isActive ? "bg-green-500" : "bg-red-500"
                      }`}></div>
                    <span className={`font-medium ${profile.isActive ? "text-green-800" : "text-red-800"
                      }`}>
                      {profile.isActive ? "Sẵn sàng hiến máu" : "Tạm hoãn"}
                    </span>
                  </div>
                  <span className={`text-sm ${profile.isActive ? "text-green-600" : "text-red-600"
                    }`}>
                    {profile.isActive ? "Tình trạng tốt" : "Cần kiểm tra"}
                  </span>
                </div>

                {profile.restDate && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-blue-800">Ngày nghỉ tiếp theo</span>
                    </div>
                    <span className="text-blue-600 text-sm">
                      {formatDate(profile.restDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Tổng lần hiến</p>
                  <p className="text-3xl font-bold text-gray-800">{completedDonations}</p>
                  <p className="text-green-600 text-sm mt-1">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    {completedDonations > 0 ? "Hoạt động tích cực" : "Chưa có hoạt động"}
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

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Nhóm máu</p>
                  <p className="text-3xl font-bold text-gray-800">{bloodType}</p>
                  <p className="text-purple-600 text-sm mt-1">
                    {bloodType.includes('O-') ? 'Hiếm có' :
                      bloodType.includes('AB') ? 'Đặc biệt' :
                        'Phổ biến'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Thành tích</p>
                  <p className="text-3xl font-bold text-gray-800">{unlockedAchievements.length}</p>
                  <p className="text-yellow-600 text-sm mt-1">đã đạt được</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Thành tích gần đây
                </h3>
                <button className="text-yellow-500 hover:text-yellow-600 text-sm font-medium">Xem tất cả →</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentAchievements.map((achievement) => {
                  const IconComponent = getAchievementIcon(achievement.achievementName || achievement.icon || '');
                  return (
                    <div
                      key={achievement.achievementId}
                      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                    >
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{achievement.achievementName}</p>
                        <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                        {achievement.dateUnlocked && (
                          <p className="text-xs text-yellow-600 mt-1">
                            {formatDate(achievement.dateUnlocked)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Donations */}
          {/* <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-500" />
                Hoạt động hiến máu gần đây
              </h3>
              <Link to="/history" className="text-red-500 hover:text-red-600 text-sm font-medium">Xem tất cả →</Link>
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
                          {donation.name || `Hiến máu ${donation.volume || donation.volumeToTake || 350}ml`}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                          {getStatusText(donation.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(donation.date)}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {donation.location || donation.event || 'Không xác định'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div> */}

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