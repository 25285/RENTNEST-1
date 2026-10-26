import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Search, Users, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, User, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sampleTestimonials } from '../data/mockData';

const AuthPage = () => {
  const { login, userRole, switchRole } = useAuth();
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState(userRole || 'tenant');
  const [email, setEmail] = useState('priya.sharma@gmail.com');
  const [password, setPassword] = useState('RentNest2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [name, setName] = useState('Priya Sharma');
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'tenant') {
      setEmail('priya.sharma@gmail.com');
      setName('Priya Sharma');
    } else {
      setEmail('vikram.patel@rentnest.in');
      setName('Vikram Patel');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, selectedRole, name);
    if (selectedRole === 'landlord') {
      navigate('/landlord');
    } else {
      navigate('/tenant');
    }
  };

  const handleOAuthLogin = (provider) => {
    login(`${provider.toLowerCase()}.user@example.com`, selectedRole, `${provider} User`);
    if (selectedRole === 'landlord') {
      navigate('/landlord');
    } else {
      navigate('/tenant');
    }
  };

  const currentTestimonial = sampleTestimonials[activeTestimonialIdx];

  return (
    <div className="auth-page-container">
      <div className="auth-split-layout">
        {/* Left Side Banner */}
        <div className="auth-left-banner">
          <div className="auth-brand-header">
            <Link to="/" className="brand-logo">
              <div className="logo-icon-box">
                <Home size={22} strokeWidth={2.5} />
              </div>
              <div className="brand-text">
                <span className="brand-name">Rent<span className="highlight">Nest</span></span>
                <span className="brand-tagline">Find. Connect. Rent.</span>
              </div>
            </Link>
          </div>

          <div className="auth-hero-copy">
            <h1 className="auth-hero-title">
              Your <span className="highlight">Next Home</span> is Just a Click Away
            </h1>
            <p className="auth-hero-subtitle">
              RentNest connects landlords and tenants, making the rental process simple, transparent and hassle-free.
            </p>

            <div className="auth-feature-badges">
              {/* Feature 1 */}
              <div className="auth-feat-item">
                <div className="auth-feat-icon-circle">
                  <Search size={20} />
                </div>
                <div className="auth-feat-text">
                  <h4>Find Homes</h4>
                  <p>Explore verified rental properties that fit your lifestyle.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="auth-feat-item">
                <div className="auth-feat-icon-circle">
                  <Users size={20} />
                </div>
                <div className="auth-feat-text">
                  <h4>Connect Easily</h4>
                  <p>Directly connect with landlords and genuine tenants.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="auth-feat-item">
                <div className="auth-feat-icon-circle">
                  <ShieldCheck size={20} />
                </div>
                <div className="auth-feat-text">
                  <h4>Rent with Confidence</h4>
                  <p>Transparent listings and secure communication.</p>
                </div>
              </div>
            </div>

            {/* Floating Glassmorphism Testimonial Card */}
            <div className="auth-floating-testimonial">
              <div className="testimonial-quote">
                <span className="quote-icon">“</span>
                <p>{currentTestimonial.quote} ”</p>
              </div>

              <div className="testimonial-author-row">
                <div className="author-info">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    className="author-avatar"
                  />
                  <div>
                    <h5 className="author-name">{currentTestimonial.name}</h5>
                    <span className="author-role">{currentTestimonial.role}</span>
                  </div>
                </div>

                <div className="carousel-indicators">
                  {sampleTestimonials.map((_, idx) => (
                    <span
                      key={idx}
                      onClick={() => setActiveTestimonialIdx(idx)}
                      className={`carousel-dot ${activeTestimonialIdx === idx ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#64748B' }}>
            Trusted by 50,000+ residents & owners across Hyderabad and Bangalore
          </div>
        </div>

        {/* Right Side Form Card */}
        <div className="auth-right-panel">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <h2>{isLoginMode ? 'Welcome Back!' : 'Join RentNest'}</h2>
              <p>{isLoginMode ? 'Log in to your RentNest account' : 'Create an account to start browsing or listing'}</p>
            </div>

            {/* Role Switcher Pills */}
            <div className="auth-role-tabs">
              <button
                type="button"
                onClick={() => handleRoleSelect('tenant')}
                className={`auth-role-tab ${selectedRole === 'tenant' ? 'active' : ''}`}
              >
                <User size={16} />
                <span>Tenant</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('landlord')}
                className={`auth-role-tab ${selectedRole === 'landlord' ? 'active' : ''}`}
              >
                <Building2 size={16} />
                <span>Landlord</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLoginMode && (
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <User size={18} className="input-icon-left" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Email address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon-left" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon-left" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="input-icon-right"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-options-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#0C7A59' }}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to ' + email); }} className="forgot-link">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn-auth-submit">
                <span>{isLoginMode ? 'Log In' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </button>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <div className="oauth-buttons">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('Google')}
                  className="btn-oauth"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-1.9.4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.8-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin('GitHub')}
                  className="btn-oauth"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>
              </div>

              <div className="auth-toggle-footer">
                <span>{isLoginMode ? "Don't have an account?" : "Already have an account?"}</span>
                <button
                  type="button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="auth-toggle-btn"
                >
                  {isLoginMode ? 'Sign Up' : 'Log In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
