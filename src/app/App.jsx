import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner, ErrorBoundary } from '@/components/common';
import CommandPalette from '@/components/common/CommandPalette';
import PublicLayout from '@/components/layout/PublicLayout';
import AppShell from '@/components/layout/AppShell';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy-loaded pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const GithubCallbackPage = lazy(() => import('@/pages/GithubCallbackPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const NewProjectPage = lazy(() => import('@/pages/NewProjectPage'));
const BuilderPage = lazy(() => import('@/pages/BuilderPage'));
const CodeViewerPage = lazy(() => import('@/pages/CodeViewerPage'));
const DeployPage = lazy(() => import('@/pages/DeployPage'));
const ProjectSettingsPage = lazy(() => import('@/pages/ProjectSettingsPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const BillingPage = lazy(() => import('@/pages/BillingPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const FeaturesPage = lazy(() => import('@/pages/FeaturesPage'));

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <ErrorBoundary>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <Suspense fallback={<Loading />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
              <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
              <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
              <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
            </Route>

            {/* Auth routes */}
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
            <Route path="/auth/github/callback" element={<PageTransition><GithubCallbackPage /></PageTransition>} />
            <Route path="/auth/github-auth/callback" element={<PageTransition><GithubCallbackPage /></PageTransition>} />

            {/* Protected routes with AppShell */}
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
              <Route path="/projects/new" element={<PageTransition><NewProjectPage /></PageTransition>} />
              <Route path="/projects/:id/code" element={<PageTransition><CodeViewerPage /></PageTransition>} />
              <Route path="/projects/:id/settings" element={<PageTransition><ProjectSettingsPage /></PageTransition>} />
              <Route path="/projects/:id/deploy" element={<PageTransition><DeployPage /></PageTransition>} />
              <Route path="/account" element={<PageTransition><AccountPage /></PageTransition>} />
              <Route path="/account/billing" element={<PageTransition><BillingPage /></PageTransition>} />
            </Route>

            {/* Builder — full screen */}
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <BuilderPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  );
}
