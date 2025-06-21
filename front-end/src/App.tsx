import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './router/ProtectedRoute';
import React, { useState, useCallback } from 'react';
import ToastContainer from './features/auth/components/ToastContainer';
import type { Toast } from './features/auth/types/auth.types';

//authpages
import LoginPage from './features/auth/pages/LoginPages';
import RegisterPage from './features/auth/pages/RegisterPage';
//admin
import AdminPage from './features/admin/pages/adminPage';

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
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<LoginPage showToast={showToast} />} />
        <Route path="/register" element={<RegisterPage showToast={showToast} />} />
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}> 
          <Route path="/admin" element={<AdminPage showToast={showToast} />} />        </Route>
        <Route element={<ProtectedRoute allowedRoles={['STAFF']} />}> 
          <Route path="/staff" element={<h1>Staff Page</h1>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;