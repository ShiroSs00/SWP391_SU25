export interface ProfileData {
  profileId: string;
  accountId: string;
  username: string;
  email: string;
  name: string;
  phone?: string;
  dob?: string; // date-time
  gender: boolean;
  address?: {
    street?: string;
    ward?: string;
    city?: string;
    state?: string;
  };
  numberOfBloodDonation?: number;
  bloodType: string;
  achievementName?: string;
  restDate?: string; // date
  creationDate?: string; // date
  isActive: boolean;
  avatarUrl?: string; // Thêm thuộc tính avatarUrl
  recentActivities?: Array<{
    description: string;
    timeAgo: string;
  }>;
}

// Thêm các kiểu InfoCardProps và AchievementCardProps vào types
export interface InfoCardProps {
  icon: React.ElementType; // Đảm bảo icon là React component hợp lệ
  label: string;
  value: string | number;
  color?: string;
}

export interface AchievementCardProps {
  icon: React.ElementType; // Đảm bảo icon là React component hợp lệ
  title: string;
  value: string | number;
  color: string;
  bgColor: string;
}

// Sửa logic lưu token người dùng, loại bỏ console log
export const saveUserToken = (profile: ProfileData) => {
  if (!profile || !profile.username || !profile.email) {
    return;
  }

  const userToken = {
    username: profile.username,
    email: profile.email,
  };

  localStorage.setItem("userToken", JSON.stringify(userToken));
};

export const getUserToken = () => {
  const userToken = localStorage.getItem("userToken");
  if (!userToken) {
    return null;
  }

  try {
    return JSON.parse(userToken);
  } catch {
    return null;
  }
};

export interface DonationItem {
  registrationId: string;
  eventId: string;
  accountId: string;
  dateCreated: string;
  status: string;
}