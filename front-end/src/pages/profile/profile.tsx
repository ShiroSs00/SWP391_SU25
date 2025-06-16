// Profile.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../../components/sections/ProfileCard';
import DonationHistoryTable from "../../components/sections/DonationHistoryTable.tsx";
import type {BloodDonationHistory, User, Profile} from "../../types/types.ts";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     navigate('/login');
  //   }
  // }, [navigate]);

  const [profile] = useState<User>({
    // Thêm BaseEntity fields
    createdAt: new Date(),
    updatedAt: new Date(),
    profileId: 1,

    // Account fields
    accountId: 'UUID123456789',
    username: 'nguyenvana',
    email: 'nguyenvana@email.com',
    role: "member",
    isActive: true,

    // Profile fields
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    dob: '1995-05-20', // hoặc new Date('1995-05-20')
    gender: true, // true: Nam, false: Nữ (hoặc dùng 'male'/'female')
    numberOfBloodDonation: 5,
    achievement: 85,
    bloodCode: 'O+',
  });

  const [BloodDonationHistory] = useState<BloodDonationHistory[]>([
    {
      historyId: 1,
      accountId: 'UUID123456789',
      eventId: 'EVT001',
      bloodType: 'O+',
      component: 'whole_blood',
      bloodVolume: 350,
      locationDonated: 'Bệnh viện Chợ Rẫy',
      healthStatus: 'Good',
      status: 'completed',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      historyId: 2,
      accountId: 'UUID123456789',
      eventId: 'EVT002',
      bloodType: 'O+',
      component: 'plasma',
      bloodVolume: 450,
      locationDonated: 'Trung tâm Huyết học',
      healthStatus: 'Good',
      status: 'completed',
      createdAt: new Date('2023-11-20'),
      updatedAt: new Date('2023-11-20'),
    },
    {
      historyId: 3,
      accountId: 'UUID123456789',
      eventId: 'EVT003',
      bloodType: 'O+',
      component: 'platelets',
      bloodVolume: 400,
      locationDonated: 'Bệnh viện Bình Dan',
      healthStatus: 'Good',
      status: 'completed',
      createdAt: new Date('2023-08-10'),
      updatedAt: new Date('2023-08-10'),
    },
    {
      historyId: 4,
      accountId: 'UUID123456789',
      eventId: 'EVT004',
      bloodType: 'O+',
      component: 'red_blood_cells',
      bloodVolume: 350,
      locationDonated: 'Ngân hàng máu TP.HCM',
      healthStatus: 'Good',
      status: 'completed',
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-05-15'),
    },
    {
      historyId: 5,
      accountId: 'UUID123456789',
      eventId: 'EVT005',
      bloodType: 'O+',
      component: 'whole_blood',
      bloodVolume: 450,
      locationDonated: 'Bệnh viện Thống Nhất',
      healthStatus: 'Good',
      status: 'completed',
      createdAt: new Date('2023-02-28'),
      updatedAt: new Date('2023-02-28'),
    }
  ]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <ProfileCard profile={profile as Profile} />
          <DonationHistoryTable donations={BloodDonationHistory} />
        </div>
      </div>
  );
};

export default Profile;