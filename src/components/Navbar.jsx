import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, User, LogOut, Heart, Search, LayoutDashboard, Building2, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { userRole, switchRole, isAuthenticated, currentUser, logout, setIsAddModalOpen, favorites } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    switchRole(role);
    if (role === 'landlord') {
      navigate('/landlord');
    } else {
      navigate('/tenant');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to={userRole === 'landlord' ? '/landlord' : '/tenant'} className="brand-logo">
          <div className="logo-icon-box">
            <Home size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Rent<span className="highlight">Nest</span></span>
            <span className="brand-tagline">Find. Connect. Rent.</span>
          </div>
        </Link>

        {/* Dynamic Nav Items */}
        <nav>
          <ul className="nav-links">
            {userRole === 'tenant' ? (
              <>
                <li>
                  <Link to="/tenant" className={`nav-link ${location.pathname === '/tenant' ? 'active' : ''}`}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/browse" className={`nav-link ${location.pathname === '/browse' ? 'active' : ''}`}>
                    Find Homes
                  </Link>
                </li>
                <li>
                  <Link to="/browse?filter=favorites" className={`nav-link ${location.search.includes('favorites') ? 'active' : ''}`}>
                    Favorites ({favorites.length})
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="nav-link">
                    How it Works
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/landlord" className={`nav-link ${location.pathname === '/landlord' ? 'active' : ''}`}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    Manage Properties
                  </Link>
                </li>
                <li>
                  <button onClick={() => setIsAddModalOpen(true)} className="nav-link" style={{ cursor: 'pointer' }}>
                    Add Listing
                  </button>
                </li>
                <li>
                  <Link to="/dashboard#inquiries" className="nav-link">
                    Tenant Inquiries
                  </Link>
                </li>
                <li>
                  <a href="#pricing" className="nav-link">
                    Pricing
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Actions Right */}
        <div className="nav-actions">
          {/* Quick Role Switcher Pill */}
          <div className="role-switch-container">
            <button
              onClick={() => handleRoleChange('tenant')}
              className={`role-switch-btn ${userRole === 'tenant' ? 'active' : ''}`}
              title="Preview Tenant View"
            >
              <User size={14} />
              <span>Tenant</span>
            </button>
            <button
              onClick={() => handleRoleChange('landlord')}
              className={`role-switch-btn ${userRole === 'landlord' ? 'active' : ''}`}
              title="Preview Landlord View"
            >
              <Building2 size={14} />
              <span>Landlord</span>
            </button>
          </div>

          {/* Landlord Specific CTA Buttons */}
          {userRole === 'landlord' && (
            <>
              <Link to="/dashboard" className="btn-outline">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Add Property</span>
              </button>
            </>
          )}

          {/* User Auth Info / Controls */}
          {isAuthenticated ? (
            <div className="user-profile-badge" title={`${currentUser.name} (${userRole})`}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="user-avatar"
              />
              <button onClick={logout} title="Log Out" style={{ color: '#64748B' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary">
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
