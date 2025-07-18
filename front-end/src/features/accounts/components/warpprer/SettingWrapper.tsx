import React from 'react';
import { useNavigate } from 'react-router-dom';
import  SettingsPage  from '../../pages/SettingsPage';
import { useDashboard } from '../../hooks/useDashboard';

export const SettingsWrapper: React.FC = () => {
  const navigate = useNavigate();
  const {
    profile,
    handleProfileUpdate,
  } = useDashboard();

  const handleChangePassword = () => {
    navigate('/settings/password');
  };

  const handlePrivacySettings = () => {
    navigate('/settings/privacy');
  };

  const handleNotificationSettings = () => {
    navigate('/settings/notifications');
  };

  const handleAccountSecurity = () => {
    navigate('/settings/security');
  };

  const handleDataExport = () => {
    navigate('/settings/export');
  };

  const handleDeleteAccount = () => {
    navigate('/settings/delete-account');
  };

  const handleLanguageSettings = () => {
    navigate('/settings/language');
  };

  const handleThemeSettings = () => {
    navigate('/settings/theme');
  };

  const handleHelpSupport = () => {
    navigate('/help');
  };

  const handleTermsOfService = () => {
    navigate('/terms');
  };

  const handlePrivacyPolicy = () => {
    navigate('/privacy');
  };

  const handleNavigateToProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <SettingsPage
      profile={profile}
      onUpdate={handleProfileUpdate}
    //   onChangePassword={handleChangePassword}
    //   onPrivacySettings={handlePrivacySettings}
    //   onNotificationSettings={handleNotificationSettings}
    //   onAccountSecurity={handleAccountSecurity}
    //   onDataExport={handleDataExport}
    //   onDeleteAccount={handleDeleteAccount}
    //   onLanguageSettings={handleLanguageSettings}
    //   onThemeSettings={handleThemeSettings}
    //   onHelpSupport={handleHelpSupport}
    //   onTermsOfService={handleTermsOfService}
    //   onPrivacyPolicy={handlePrivacyPolicy}
    //   onNavigateToProfile={handleNavigateToProfile}
    //   onLogout={handleLogout}
    />
  );
};