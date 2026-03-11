import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Story from './pages/Story';
import DailyLog from './pages/DailyLog';
import Thoughts from './pages/Thoughts';
import Press from './pages/Press';
import Achievements from './pages/Achievements';
import Connect from './pages/Connect';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGuard from './components/AdminGuard';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/page/story" element={<Story />} />
      <Route path="/page/daily-log" element={<DailyLog />} />
      <Route path="/page/thoughts" element={<Thoughts />} />
      <Route path="/page/press" element={<Press />} />
      <Route path="/page/achievements" element={<Achievements />} />
      <Route path="/page/connect" element={<Connect />} />

      {/* Legacy redirects */}
      <Route path="/story" element={<Navigate to="/page/story" replace />} />
      <Route path="/daily-log" element={<Navigate to="/page/daily-log" replace />} />
      <Route path="/thoughts" element={<Navigate to="/page/thoughts" replace />} />
      <Route path="/press" element={<Navigate to="/page/press" replace />} />
      <Route path="/achievements" element={<Navigate to="/page/achievements" replace />} />
      <Route path="/connect" element={<Navigate to="/page/connect" replace />} />

      {/* Admin — no public layout */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route
        path="/admin/dashboard/*"
        element={
          <AdminGuard>
            <AdminDashboard />
          </AdminGuard>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
