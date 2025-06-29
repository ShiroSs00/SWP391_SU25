import React from "react";
import { Award, MapPin, Phone, Mail, Calendar, User, Camera, Trophy, Heart, Droplet } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { Header } from "../../../components/layouts/Header"; // Adjust the path if Header is in src/components/layouts/Header.tsx
import ProfileDonationHistory from "../components/ProfileDonationHistory";

const ProfilePage = () => {
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="text-red-500 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="text-gray-500 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h2 className="text-xl font-semibold mb-2">No Profile Data</h2>
            <p>No profile information available.</p>
          </div>
        </div>
      </div>
    );
  }

  const InfoCard: React.FC<{
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    color?: string;
  }> = ({ icon: Icon, label, value, color = "text-gray-600" }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <Icon className={`h-5 w-5 ${color}`} />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  const AchievementCard: React.FC<{
    icon: React.ElementType;
    title: string;
    value: React.ReactNode;
    color: string;
    bgColor: string;
  }> = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} p-4 rounded-xl border-l-4 ${color} hover:shadow-md transition-shadow`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-white ${color.replace('border-', 'text-')}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
            <span className="text-sm font-medium">Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-center">
                <div className="relative inline-block">
                  <img
                    src={profile.avatarUrl || "https://i.pinimg.com/564x/24/21/85/242185eaef43192fc3f9646932fe3b46.jpg"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">{profile.name}</h2>
                <p className="text-indigo-100">@{profile.username}</p>
                <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm bg-white/20 text-white">
                  <Droplet className="h-4 w-4 mr-1" />
                  {profile.bloodType || "Unknown"} Blood Type
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 space-y-4">
                <InfoCard 
                  icon={User} 
                  label="User ID" 
                  value={profile.profileId || "N/A"} 
                />
                <InfoCard 
                  icon={Phone} 
                  label="Phone Number" 
                  value={profile.phone || "N/A"} 
                  color="text-green-600"
                />
                <InfoCard 
                  icon={Mail} 
                  label="Email Address" 
                  value={profile.email || "N/A"} 
                  color="text-blue-600"
                />
                <InfoCard 
                  icon={Calendar} 
                  label="Date of Birth" 
                  value={profile.dob ? new Date(profile.dob).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : "N/A"} 
                  color="text-purple-600"
                />
                <InfoCard 
                  icon={MapPin} 
                  label="Address" 
                  value={profile.address ? `${profile.address.street || "N/A"}, ${profile.address.city || "N/A"}` : "N/A"} 
                  color="text-red-600"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Achievements Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AchievementCard
                  icon={Award}
                  title="Achievement Badge"
                  value={profile.achievementName || "No achievements yet"}
                  color="border-yellow-400 text-yellow-600"
                  bgColor="bg-yellow-50"
                />
                <AchievementCard
                  icon={Heart}
                  title="Blood Donations"
                  value={`${profile.numberOfBloodDonation || 0} donations completed`}
                  color="border-red-400 text-red-600"
                  bgColor="bg-red-50"
                />
              </div>
            </div>

            {/* Statistics Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{profile.numberOfBloodDonation || 0}</div>
                  <div className="text-sm text-blue-700 mt-1">Total Donations</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">{profile.bloodType || "Unknown"}</div>
                  <div className="text-sm text-green-700 mt-1">Blood Type</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">
                    {profile.dob ? new Date().getFullYear() - new Date(profile.dob).getFullYear() : "N/A"}
                  </div>
                  <div className="text-sm text-purple-700 mt-1">Years Old</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {profile.recentActivities && profile.recentActivities.length > 0 ? (
                  profile.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Heart className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.timeAgo}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No recent activities available.</p>
                )}
              </div>

              {/* Add Blood Donation History */}
              <div className="mt-6">
                <ProfileDonationHistory accountId={profile.profileId || ""} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;