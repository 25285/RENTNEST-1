import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ArrowRight, ShieldCheck, Heart, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { showToast } = useAuth();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      showToast('Thank you for subscribing to RentNest updates!');
      setEmail('');
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div className="footer-col">
            <Link to="/" className="brand-logo" style={{ marginBottom: '16px' }}>
              <div className="logo-icon-box">
                <Home size={22} strokeWidth={2.5} />
              </div>
              <div className="brand-text">
                <span className="brand-name">Rent<span className="highlight">Nest</span></span>
                <span className="brand-tagline">Find. Connect. Rent.</span>
              </div>
            </Link>
            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, maxWidth: '320px', marginBottom: '20px' }}>
              RentNest is India's premier verified rental property ecosystem connecting property owners and tenants directly with zero brokerage and total transparency.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0C7A59', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>100% Direct Owner Listings & Verified Profiles</span>
            </div>
          </div>

          {/* Tenants Col */}
          <div className="footer-col">
            <h4>For Tenants</h4>
            <ul className="footer-links">
              <li className="footer-link-item"><Link to="/browse">Search Rental Homes</Link></li>
              <li className="footer-link-item"><Link to="/browse?city=Hyderabad">Hyderabad Properties</Link></li>
              <li className="footer-link-item"><Link to="/browse?city=Bangalore">Bangalore Properties</Link></li>
              <li className="footer-link-item"><a href="#how-it-works">Zero Brokerage Guarantee</a></li>
              <li className="footer-link-item"><a href="#faq">Rental Agreement Assistance</a></li>
            </ul>
          </div>

          {/* Landlords Col */}
          <div className="footer-col">
            <h4>For Property Owners</h4>
            <ul className="footer-links">
              <li className="footer-link-item"><Link to="/landlord">List Your Property</Link></li>
              <li className="footer-link-item"><Link to="/dashboard">Owner Dashboard</Link></li>
              <li className="footer-link-item"><a href="#screening">Tenant Background Checks</a></li>
              <li className="footer-link-item"><a href="#pricing">Listing Pricing Plans</a></li>
              <li className="footer-link-item"><a href="#calculator">Rental Yield Estimator</a></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="footer-col">
            <h4>Stay Connected</h4>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '14px' }}>
              Get instant alerts for freshly listed properties in your preferred IT corridors.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                style={{ padding: '10px 14px', fontSize: '0.85rem', flex: 1 }}
                required
              />
              <button type="submit" className="btn-primary" style={{ padding: '10px 14px' }}>
                <ArrowRight size={16} />
              </button>
            </form>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#94A3B8' }}>
              <span>Support: contact@rentnest.in</span>
              <span>Toll Free: 1800-200-NEST</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} RentNest Technologies Private Limited. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#privacy" style={{ color: '#64748B' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: '#64748B' }}>Terms of Service</a>
            <a href="#security" style={{ color: '#64748B' }}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
