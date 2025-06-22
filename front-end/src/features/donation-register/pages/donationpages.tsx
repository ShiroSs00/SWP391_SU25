import React, { useState, useEffect } from 'react';
import { getAllEvents } from '../../admin/hooks/useEvents';
import type { AdminEvent } from '../../admin/types/admin.types';
import DonationCreate from '../components/donation-create';

const getAccountId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.accountId || '';
  } catch {
    return '';
  }
};

const DonationPages: React.FC = () => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const accountId = getAccountId();
  const [showToastMsg, setShowToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    getAllEvents().then(setEvents);
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setShowToastMsg(msg);
    setToastType(type);
    setTimeout(() => setShowToastMsg(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        {showToastMsg && (
          <div className={`mb-4 px-4 py-2 rounded shadow text-white font-semibold animate-fade-in-up ${toastType === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
            {showToastMsg}
          </div>
        )}
        <DonationCreate events={events} accountId={accountId} showToast={showToast} hideStatus />
      </div>
    </div>
  );
};

export default DonationPages;
