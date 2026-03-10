import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spinner } from '@/components/common';
import PublicLayout from '@/components/layout/PublicLayout';
import AppShell from '@/components/layout/AppShell';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy-loaded pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const NewProjectPage = lazy(() => import('@/pages/NewProjectPage'));
const BuilderPage = lazy(() => import('@/pages/BuilderPage'));
const DeployPage = lazy(() => import('@/pages/DeployPage'));
const ProjectSettingsPage = lazy(() => import('@/pages/ProjectSettingsPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const BillingPage = lazy(() => import('@/pages/BillingPage'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth routes (no layout shell) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected routes with AppShell */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects/new" element={<NewProjectPage />} />
          <Route path="/projects/:id/settings" element={<ProjectSettingsPage />} />
          <Route path="/projects/:id/deploy" element={<DeployPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/billing" element={<BillingPage />} />
        </Route>

        {/* Builder — full screen, no AppShell sidebar */}
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <BuilderPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
