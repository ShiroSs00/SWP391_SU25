import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './router/ProtectedRoute';
import { useState, useCallback } from 'react';
import ToastContainer from './features/auth/components/ToastContainer';
import type { Toast } from './features/auth/types/auth.types';

//authpages
import LoginPage from './features/auth/pages/LoginPages';
import RegisterPage from './features/auth/pages/RegisterPage';
//admin
import AdminPage from './features/admin/pages/adminPage';

//homePages
import HomePage from './pages/HomePage';
//health-check
import HealthCheckPage from './features/health-checks/pages/HealthCheckPage'
//donation
import DonationPages from './features/donation-register/pages/donationpages';
//staff
import StaffPage from './features/staff/pages/staffPage';

// BlogPage
import BlogPage from './features/blog/pages/BlogPage';
// Feedback Page
import { FeedbackPage } from "./features/donor-feedback/pages/FeedbackPage.tsx";
import { SurveyPage } from './features/donor-feedback/pages/SurveyPage.tsx';
import { FeedbackForm } from './features/donor-feedback/components/FeedbackForm.tsx';
import { GeneralFeedback } from './features/donor-feedback/pages/GeneralFeedback.tsx';
import { PersonalInfo } from './features/donor-feedback/components/PersonalInfo.tsx';
function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <Router>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="health-check" element={<HealthCheckPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="/profile" element={<PersonalInfo />} />
        <Route path="survey" element={<SurveyPage />} />
        <Route path="feedback-form" element={<FeedbackForm registrationId="" onSubmit={async () => { }} />} />
        <Route path="general-feedback" element={<GeneralFeedback />} />
        <Route path="blog-page" element={<BlogPage />} />
        <Route path="/login" element={<LoginPage showToast={showToast} />} />
        <Route path="/register" element={<RegisterPage showToast={showToast} />} />
        <Route path="/donation" element={<DonationPages />} />
        <Route path="/donation/:eventId" element={<DonationPages />} />
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminPage showToast={showToast} />} />        </Route>
        <Route element={<ProtectedRoute allowedRoles={['STAFF']} />}>
          <Route path="/staff" element={<StaffPage />} />
        </Route>
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;