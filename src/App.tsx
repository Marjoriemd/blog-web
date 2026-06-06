import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import FeedPage from './pages/FeedPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/me" element={<ProfilePage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
