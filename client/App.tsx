import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { IssuesProvider } from "./contexts/IssuesContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// User pages
import Dashboard from "./pages/Dashboard";
import SchedulePickup from "./pages/SchedulePickup";
import ReportIssues from "./pages/ReportIssues";
import PickupHistory from "./pages/PickupHistory";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCommunities from "./pages/AdminCommunities";
import AdminRoutes from "./pages/AdminRoutes";
import AdminServiceAreas from "./pages/AdminServiceAreas";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";

import "./global.css";

function App() {
  return (
    <AuthProvider>
      <IssuesProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes - Protected */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireUser>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/schedule-pickup" element={
              <ProtectedRoute requireUser>
                <SchedulePickup />
              </ProtectedRoute>
            } />
            <Route path="/report-issues" element={
              <ProtectedRoute requireUser>
                <ReportIssues />
              </ProtectedRoute>
            } />
            <Route path="/pickup-history" element={
              <ProtectedRoute requireUser>
                <PickupHistory />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute requireUser>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute requireUser>
                <Reports />
              </ProtectedRoute>
            } />

            {/* Admin Routes - Protected */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/communities" element={
              <ProtectedRoute requireAdmin>
                <AdminCommunities />
              </ProtectedRoute>
            } />

            {/* Placeholder admin routes */}
            <Route path="/admin/routes" element={
              <ProtectedRoute requireAdmin>
                <AdminRoutes />
              </ProtectedRoute>
            } />
            <Route path="/admin/areas" element={
              <ProtectedRoute requireAdmin>
                <AdminServiceAreas />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute requireAdmin>
                <AdminAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requireAdmin>
                <AdminSettings />
              </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </IssuesProvider>
    </AuthProvider>
  );
}

export default App;
