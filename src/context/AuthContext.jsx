import React, { createContext, useContext, useState, useEffect } from 'react';
import { sampleProperties, sampleInquiries } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // User role: 'tenant' or 'landlord'
  const [userRole, setUserRole] = useState('landlord');
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: 'Vikram Patel',
    email: 'vikram.patel@rentnest.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'landlord'
  });

  // Properties state initialized with sample data
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('rentnest_properties');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return sampleProperties;
      }
    }
    return sampleProperties;
  });

  // Favorites state for tenants
  const [favorites, setFavorites] = useState(['prop-1', 'prop-3']);

  // Inquiries state
  const [inquiries, setInquiries] = useState(sampleInquiries);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);

  // Property Loading Overlay state
  const [loadingProperty, setLoadingProperty] = useState(null);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);

  const openPropertyWithLoading = (property) => {
    if (!property) return;
    setLoadingProperty(property);
    setIsLoadingProperty(true);
  };

  const handlePropertyLoadingComplete = (property) => {
    setIsLoadingProperty(false);
    setLoadingProperty(null);
    setSelectedProperty(property);
  };

  // Toast / notification feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync properties to localStorage for persistence during exploration
  useEffect(() => {
    try {
      localStorage.setItem('rentnest_properties', JSON.stringify(properties));
    } catch (e) {
      console.error(e);
    }
  }, [properties]);

  // Switch role helper
  const switchRole = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'tenant') {
      setCurrentUser({
        name: 'Priya Sharma',
        email: 'priya.sharma@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        role: 'tenant'
      });
    } else {
      setCurrentUser({
        name: 'Vikram Patel',
        email: 'vikram.patel@rentnest.in',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        role: 'landlord'
      });
    }
    showToast(`Switched to ${newRole === 'tenant' ? 'Tenant' : 'Landlord'} View`, 'info');
  };

  const login = (email, role = 'tenant', customName) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setCurrentUser({
      name: customName || (role === 'tenant' ? 'Priya Sharma' : 'Vikram Patel'),
      email: email || (role === 'tenant' ? 'priya.sharma@gmail.com' : 'vikram.patel@rentnest.in'),
      avatar: role === 'tenant' 
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role
    });
    showToast(`Welcome back, ${customName || (role === 'tenant' ? 'Priya' : 'Vikram')}!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Logged out successfully', 'info');
  };

  // Add a new property
  const addProperty = (newProp) => {
    const id = `prop-${Date.now()}`;
    const propertyWithDefaults = {
      id,
      viewsToday: 1,
      inquiries: 0,
      shortlisted: 0,
      status: 'Available',
      postedDate: 'Just now',
      landlordName: currentUser.name,
      landlordPhone: '+91 98450 12345',
      landlordEmail: currentUser.email,
      featured: false,
      amenities: newProp.amenities?.length ? newProp.amenities : ['24/7 Security', 'Elevator', 'Power Backup'],
      ...newProp,
      price: Number(newProp.price) || 20000,
      deposit: Number(newProp.deposit) || (Number(newProp.price) * 2 || 40000),
      bedrooms: Number(newProp.bedrooms) || 2,
      bathrooms: Number(newProp.bathrooms) || 2,
      area: Number(newProp.area) || 1200
    };

    setProperties(prev => [propertyWithDefaults, ...prev]);
    showToast(`"${propertyWithDefaults.title}" added to your portfolio!`);
    return propertyWithDefaults;
  };

  // Edit existing property
  const editProperty = (id, updatedFields) => {
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast('Property details updated successfully!');
  };

  // Delete property
  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    showToast('Property removed from portfolio', 'warning');
  };

  // Toggle status: Available <-> Occupied
  const togglePropertyStatus = (id) => {
    setProperties(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === 'Available' ? 'Occupied' : 'Available';
          showToast(`Marked as ${nextStatus}!`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Favorite toggle
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast('Saved to your favorites ❤️', 'success');
        return [...prev, id];
      }
    });
  };

  // Submit inquiry
  const addInquiry = (inquiryData) => {
    const newInquiry = {
      id: `inq-${Date.now()}`,
      date: 'Just now',
      status: 'New',
      type: 'Direct Inquiry',
      tenantName: currentUser.name || 'Interested Tenant',
      tenantEmail: currentUser.email || 'tenant@rentnest.in',
      tenantPhone: '+91 98765 43210',
      ...inquiryData
    };
    setInquiries(prev => [newInquiry, ...prev]);
    
    // Also increment inquiries count for that property
    if (inquiryData.propertyId) {
      setProperties(prev =>
        prev.map(p => p.id === inquiryData.propertyId ? { ...p, inquiries: (p.inquiries || 0) + 1 } : p)
      );
    }
    showToast('Your inquiry has been sent to the landlord!');
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        setUserRole,
        switchRole,
        isAuthenticated,
        currentUser,
        login,
        logout,
        properties,
        setProperties,
        addProperty,
        editProperty,
        deleteProperty,
        togglePropertyStatus,
        favorites,
        toggleFavorite,
        inquiries,
        setInquiries,
        addInquiry,
        isAddModalOpen,
        setIsAddModalOpen,
        selectedProperty,
        setSelectedProperty,
        loadingProperty,
        setLoadingProperty,
        isLoadingProperty,
        setIsLoadingProperty,
        openPropertyWithLoading,
        handlePropertyLoadingComplete,
        editingProperty,
        setEditingProperty,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
