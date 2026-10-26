import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PickerChatbot from './components/PickerChatbot';
import AddPropertyModal from './components/AddPropertyModal';
import PropertyDetailModal from './components/PropertyDetailModal';
import PropertyLoadingScreen from './components/PropertyLoadingScreen';
import TenantHome from './pages/TenantHome';
import LandlordHome from './pages/LandlordHome';
import PropertyBrowse from './pages/PropertyBrowse';
import LandlordDashboard from './pages/LandlordDashboard';
import AuthPage from './pages/AuthPage';
import { useAuth } from './context/AuthContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import './App.css';

function App() {
  const {
    userRole,
    toastMessage,
    loadingProperty,
    isLoadingProperty,
    handlePropertyLoadingComplete
  } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="app-shell">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className={`toast-notification ${toastMessage.type || 'success'}`}>
          {toastMessage.type === 'warning' ? (
            <AlertCircle size={20} color="#F59E0B" />
          ) : toastMessage.type === 'info' ? (
            <Info size={20} color="#3B82F6" />
          ) : (
            <CheckCircle2 size={20} color="#10B981" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Navbar rendered on all pages except auth if desired, or even on auth as per split layout */}
      {!isAuthPage && <Navbar />}

      {/* Main Content Routes */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to={userRole === 'landlord' ? '/landlord' : '/tenant'} replace />} />
          <Route path="/tenant" element={<TenantHome />} />
          <Route path="/landlord" element={<LandlordHome />} />
          <Route path="/browse" element={<PropertyBrowse />} />
          <Route path="/dashboard" element={<LandlordDashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Modals & Loading Overlays */}
      <PropertyLoadingScreen
        property={loadingProperty}
        isOpen={isLoadingProperty}
        onComplete={handlePropertyLoadingComplete}
      />
      <AddPropertyModal />
      <PropertyDetailModal />

      {/* Floating Picker AI Assistant */}
      <PickerChatbot />

      {/* Site Footer */}
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
