import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import LoginPage from '../pages/auth/LoginPage';
import LandingPage from '../pages/auth/LandingPage';
import KycPage from '../pages/auth/KycPage';
import MainLayout from '../components/layouts/MainLayout';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/leaveTypes';

// Dashboards
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard';
import ManagerDashboard from '../pages/dashboard/ManagerDashboard';
import HRDashboard from '../pages/dashboard/HRDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';

// Attendance
import AttendancePage from '../pages/attendance/AttendancePage';
import AttendanceHistory from '../pages/attendance/AttendanceHistory';

// Leaves
import ApplyLeave from '../pages/leave/ApplyLeave';
import LeaveHistory from '../pages/leave/LeaveHistory';
import LeaveBalance from '../pages/leave/LeaveBalance';

// Manager
import PendingApprovals from '../pages/manager/PendingApprovals';
import ManagerTeam from '../pages/manager/ManagerTeam';
import ManagerKycApprovals from '../pages/manager/ManagerKycApprovals';

// HR
import HRAnalytics from '../pages/hr/HRAnalytics';
import AttendanceReport from '../pages/hr/AttendanceReport';
import LeaveReport from '../pages/hr/LeaveReport';

// Admin
import UserManagement from '../pages/admin/UserManagement';

// Errors
import NotFound from '../pages/errors/NotFound';
import Forbidden from '../pages/errors/Forbidden';
import ServerError from '../pages/errors/ServerError';
import useAuth from '../hooks/useAuth';

const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.role === ROLES.EMPLOYEE && user?.kycStatus !== 'APPROVED') {
    return <Navigate to="/kyc" replace />;
  }
  if (user?.role === ROLES.ADMIN) return <AdminDashboard />;
  if (user?.role === ROLES.HR) return <HRDashboard />;
  if (user?.role === ROLES.MANAGER) return <ManagerDashboard />;
  return <EmployeeDashboard />;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path="/register" element={<Navigate to={ROUTES.LOGIN} replace />} />

      {/* Main portal layout containing authenticated routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                {/* Dynamically route dashboard page based on user role */}
                <Route path={ROUTES.DASHBOARD} element={<DashboardRouter />} />

                {/* KYC Page */}
                <Route path="/kyc" element={<KycPage />} />

                {/* Employee / General routes */}
                <Route
                  path={ROUTES.ATTENDANCE}
                  element={
                    <RoleRoute roles={[ROLES.EMPLOYEE]}>
                      <AttendancePage />
                    </RoleRoute>
                  }
                />
                <Route
                  path={ROUTES.ATTENDANCE_HISTORY}
                  element={
                    <RoleRoute roles={[ROLES.EMPLOYEE, ROLES.MANAGER]}>
                      <AttendanceHistory />
                    </RoleRoute>
                  }
                />
                <Route
                  path={ROUTES.LEAVE_APPLY}
                  element={
                    <RoleRoute roles={[ROLES.EMPLOYEE, ROLES.MANAGER]}>
                      <ApplyLeave />
                    </RoleRoute>
                  }
                />
                <Route
                  path={ROUTES.LEAVE_HISTORY}
                  element={
                    <RoleRoute roles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.HR]}>
                      <LeaveHistory />
                    </RoleRoute>
                  }
                />
                <Route
                  path={ROUTES.LEAVE_BALANCE}
                  element={
                    <RoleRoute roles={[ROLES.EMPLOYEE, ROLES.MANAGER]}>
                      <LeaveBalance />
                    </RoleRoute>
                  }
                />

                {/* Manager KYC Approvals */}
                <Route
                  path={ROUTES.MANAGER_KYC}
                  element={
                    <RoleRoute roles={[ROLES.MANAGER]}>
                      <ManagerKycApprovals />
                    </RoleRoute>
                  }
                />

                {/* Manager / HR Leave Approvals route */}
                <Route
                  path={ROUTES.MANAGER_APPROVALS}
                  element={
                    <RoleRoute roles={[ROLES.MANAGER, ROLES.HR]}>
                      <PendingApprovals />
                    </RoleRoute>
                  }
                />
                <Route
                  path={ROUTES.MANAGER_TEAM}
                  element={
                    <RoleRoute roles={[ROLES.MANAGER]}>
                      <ManagerTeam />
                    </RoleRoute>
                  }
                />

                {/* HR analytics routes */}
                <Route
                  path={ROUTES.HR_ANALYTICS}
                  element={
                    <RoleRoute roles={[ROLES.HR]}>
                      <HRAnalytics />
                    </RoleRoute>
                  }
                />
                <Route
                  path={ROUTES.HR_ATTENDANCE_REPORT}
                  element={
                    <RoleRoute roles={[ROLES.HR, ROLES.ADMIN]}>
                      <AttendanceReport />
                    </RoleRoute>
                  }
                />
                <Route
                  path={ROUTES.HR_LEAVE_REPORT}
                  element={
                    <RoleRoute roles={[ROLES.HR, ROLES.ADMIN]}>
                      <LeaveReport />
                    </RoleRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path={ROUTES.ADMIN_USERS}
                  element={
                    <RoleRoute roles={[ROLES.ADMIN]}>
                      <UserManagement />
                    </RoleRoute>
                  }
                />

                {/* Redirect root to dashboard */}
                <Route path="" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Error pages */}
      <Route path={ROUTES.FORBIDDEN} element={<Forbidden />} />
      <Route path="/500" element={<ServerError />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
    </Routes>
  );
};

export default AppRouter;
