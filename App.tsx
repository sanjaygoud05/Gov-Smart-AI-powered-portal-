
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FindSchemes from './pages/FindSchemes';
import SchemeDetails from './pages/SchemeDetails';
import Auth from './pages/Auth';
import HowItWorks from './pages/HowItWorks';
import FAQs from './pages/FAQs';
import Settings from './pages/Settings';
import SavedSchemes from './pages/SavedSchemes';
import Dashboard from './pages/Dashboard';
import ChatWidget from './components/ChatWidget';

// Helper to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Component to protect routes that require authentication
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('gov_smart_user');
      setIsAuthenticated(!!savedUser);
    };

    checkAuth();
    // Listen for storage changes to handle login/logout across tabs or state updates
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  if (isAuthenticated === null) return null; // Wait for initial check

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes - Accessible to everyone */}
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes - Require Authentication */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/saved-schemes" element={
              <ProtectedRoute>
                <SavedSchemes />
              </ProtectedRoute>
            } />
            <Route path="/find-schemes" element={
              <ProtectedRoute>
                <FindSchemes />
              </ProtectedRoute>
            } />
            <Route path="/scheme/:id" element={
              <ProtectedRoute>
                <SchemeDetails />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
};

export default App;
