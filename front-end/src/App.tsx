import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute";
import { useState, useCallback } from "react";
import ToastContainer from "./features/auth/components/ToastContainer";
import type { Toast } from "./features/auth/types/auth.types";

//authpages
import LoginPage from "./features/auth/pages/LoginPages";
import RegisterPage from "./features/auth/pages/RegisterPage";
//admin
import AdminPage from "./features/admin/pages/adminPage";

//homePages
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import { MainLayout } from "./layouts/MainLayout/MainLayouts.tsx";
import BloodTypesPage from "./pages/Blood-TypesPage.tsx";
import EmergencyPage from "./pages/EmergencyPage.tsx";
//health-check
import HealthCheckPage from "./features/health-checks/pages/healthcheckPages";
//donation
import DonationPages from "./features/donation-register/pages/donationpages";
//blood-requests
import RequestBloodPage from "./features/request-blood/pages/request-blood.page";
//staff
import StaffPage from "./features/staff/pages/staffPage";
// BlogPage
import { BlogListWrapper } from "./features/blog/components/BlogListWrapper.tsx";
import { BlogPostWrapper } from "./features/blog/components/BlogPostWrapper";
import { CreatePostWrapper } from "./features/blog/components/CreatePostWrapper";
import { EditPostWrapper } from "./features/blog/components/EditPostWrapper";
// Feedback Page
//profile
import ProfilePage from "./features/accounts/pages/profilePage";

function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        4000
      );
    },
    []
  );

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Router>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="blood-types" element={<BloodTypesPage />} />
          <Route path="blogs" element={<BlogListWrapper />} />
        </Route>
        {/*<Route path="feedback" element={<FeedbackPage />} />*/}
        {/*<Route path="survey" element={<SurveyPage />} />*/}
        {/*<Route path="feedback-form" element={<FeedbackForm registrationId="" onSubmit={async () => { }} />} />*/}
        {/*<Route path="general-feedback" element={<GeneralFeedback />} />*/}
        <Route path="/blogs/:id" element={<BlogPostWrapper />} />
        {/*<Route path="blogs/create" element={<CreatePostWrapper />} />*/}
        <Route path="/blogs/edit/:id" element={<EditPostWrapper />} />
        <Route path="/login" element={<LoginPage showToast={showToast} />} />
        <Route
          path="/register"
          element={<RegisterPage showToast={showToast} />}
        />
        <Route path="/donation" element={<DonationPages />} />
        <Route path="/donation/:eventId" element={<DonationPages />} />
        <Route path="/request-blood" element={<RequestBloodPage />} />
        {/* Protected Routes */}
        <Route
          element={<ProtectedRoute allowedRoles={["ADMIN", "STAFF", "USER"]} />}
        ></Route>
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminPage showToast={showToast} />} />
          <Route path="blogs/create" element={<CreatePostWrapper />} />
          <Route path="/blogs/edit/:id" element={<EditPostWrapper />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["STAFF","ADMIN"]} />}>
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/health-checks/*" element={<HealthCheckPage />} />
        </Route>
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
