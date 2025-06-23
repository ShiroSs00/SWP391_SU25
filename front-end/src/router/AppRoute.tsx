import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../features/pages/HomePage";
import AboutPage from "../features/pages/AboutPage";
import ContactPage from "../features/pages/ContactPage";
import NotFoundPage from "../features/pages/NotFoundPage";
import UnauthorizedPage from "../features/pages/UnauthorizedPage";
import MaintenancePage from "../features/pages/MaintenancePage";

const AppRoute = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </BrowserRouter>
);

export default AppRoute;