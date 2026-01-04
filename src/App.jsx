import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingButtons from './components/layout/FloatingButtons';
import BroadcastBanner from './components/layout/BroadcastBanner';

// Auth Components
import LoginModal from './components/auth/LoginModal';
import SignupModal from './components/auth/SignupModal';

// Chatbot
import ChatWidget from './components/chatbot/ChatWidget';

// PWA Install Component
import InstallApp from './components/InstallApp';

// Pages
import Home from './pages/Home';
import Book from './pages/Book';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import Gallery from './pages/Gallery';
import About from './pages/About';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Refund from './pages/legal/Refund';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main App Content (needs AuthProvider context)
const AppContent = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const openSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <Navbar
        onLoginClick={openLogin}
        onSignupClick={openSignup}
      />

      {/* Main Content */}
      <main>
        <Routes>
          <Route
            path="/"
            element={<Home onBookClick={() => { }} />}
          />
          <Route
            path="/book"
            element={<Book onLoginRequired={openLogin} />}
          />
          <Route
            path="/community"
            element={<Community onLoginRequired={openLogin} />}
          />
          <Route
            path="/gallery"
            element={<Gallery />}
          />
          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms"
            element={<Terms />}
          />
          <Route
            path="/privacy"
            element={<Privacy />}
          />
          <Route
            path="/refund"
            element={<Refund />}
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer & Floating Widgets */}
      <BroadcastBanner />
      <Footer />
      <FloatingButtons />
      <ChatWidget />

      {/* PWA Install Prompt - Added here to ensure it sits on top */}
      <InstallApp />

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={closeModals}
        onSwitchToSignup={openSignup}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={closeModals}
        onSwitchToLogin={openLogin}
      />
    </div>
  );
};

// Root App Component
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;