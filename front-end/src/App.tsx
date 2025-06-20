import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './router/ProtectedRoute';



//authpages
import LoginPage from './features/auth/pages/LoginPages';
import RegisterPage from './features/auth/pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}> 
          <Route path="/admin" element={<h1>Admin Page</h1>} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['STAFF']} />}> 
          <Route path="/staff" element={<h1>Staff Page</h1>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;