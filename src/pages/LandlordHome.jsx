import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Users, ShieldCheck, BarChart3, Home, Sparkles, MessageCircle, Sliders, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';

const LandlordHome = () => {
  const { properties, setIsAddModalOpen, setSelectedProperty } = useAuth();
  const navigate = useNavigate();

  // Show top 3 properties in portfolio preview
  const portfolioProperties = properties.slice(0, 3);

  return (
    <div className="landlord-home-page">
      {/* 1. Hero Banner with Ambient Glowing Orbs */}
      <section className="landlord-hero-section">
        {/* Glowing Orbs */}
        <div className="hero-ambient-orb orb-emerald" />
        <div className="hero-ambient-orb orb-sky" />
        <div className="hero-backdrop-overlay" />

        <div className="container">
          <div className="landlord-hero-content">
            {/* Shimmer Tag Badge */}
            <div className="hero-tag-badge">
              <Sparkles size={14} />
              <span>For Property Owners • List • Manage • Grow</span>
            </div>

            {/* Main Headline with Highlight */}
            <h1 className="hero-main-title">
              Find the Right Tenants.
              <span className="highlight">Rent with Confidence.</span>
            </h1>

            {/* Description */}
            <p className="hero-description">
              List your property, connect with verified tenants, and manage every rental from one simple dashboard.
            </p>

            {/* CTAs */}
            <div className="hero-cta-group">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary hero-cta-btn-large"
              >
                <Plus size={20} strokeWidth={2.5} />
                <span>List Your Property</span>
              </button>

              <Link to="/dashboard" className="btn-white-glass">
                <span>View Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* 3 Mini Feat Row */}
            <div className="hero-mini-features">
              <div className="mini-feat-item">
                <div className="mini-feat-icon">
                  <Users size={18} />
                </div>
                <div className="mini-feat-text">
                  <h5>Reach quality tenants</h5>
                  <p>Increase visibility for your property</p>
                </div>
              </div>

              <div className="mini-feat-item">
                <div className="mini-feat-icon">
                  <ShieldCheck size={18} />
                </div>
                <div className="mini-feat-text">
                  <h5>Verified inquiries</h5>
                  <p>Connect with genuine tenants</p>
                </div>
              </div>

              <div className="mini-feat-item">
                <div className="mini-feat-icon">
                  <BarChart3 size={18} />
                </div>
                <div className="mini-feat-text">
                  <h5>Simpler property management</h5>
                  <p>Handle listings, tenants and rentals easily</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Right Overlay Card with Glassmorphism & Hover Levitation */}
          <div className="hero-floating-card">
            <div className="floating-card-icon">
              <Home size={24} />
            </div>
            <div className="floating-card-body">
              <h4>Turn Your Property Into Opportunity</h4>
              <p>List your property, reach verified tenants and earn steady rental income.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="floating-card-link"
              >
                <span>Get Started</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Highlights Row (4 Soft-Accent Colored Cards with Hover Tilt & Glow) */}
      <section className="feature-highlights-section">
        <div className="container">
          <div className="feature-cards-grid">
            {/* Card 1: Mint */}
            <div className="feature-accent-card mint" onClick={() => setIsAddModalOpen(true)}>
              <div className="feature-icon-wrapper">
                <Home size={22} strokeWidth={2.2} />
              </div>
              <h3>Easy Listing Management</h3>
              <p>Add, edit and manage your property details, photos and amenities with ease.</p>
            </div>

            {/* Card 2: Blue */}
            <div className="feature-accent-card blue" onClick={() => navigate('/dashboard#inquiries')}>
              <div className="feature-icon-wrapper">
                <Users size={22} strokeWidth={2.2} />
              </div>
              <h3>Quality Tenant Leads</h3>
              <p>Get inquiries from verified tenants and track their interest in real-time.</p>
            </div>

            {/* Card 3: Peach */}
            <div className="feature-accent-card peach" onClick={() => navigate('/dashboard')}>
              <div className="feature-icon-wrapper">
                <BarChart3 size={22} strokeWidth={2.2} />
              </div>
              <h3>Rental Performance</h3>
              <p>See views, inquiries and engagement for each property to make better decisions.</p>
            </div>

            {/* Card 4: Lavender */}
            <div className="feature-accent-card lavender" onClick={() => navigate('/dashboard#inquiries')}>
              <div className="feature-icon-wrapper">
                <ShieldCheck size={22} strokeWidth={2.2} />
              </div>
              <h3>Secure Communication</h3>
              <p>Chat with potential tenants, share documents and manage the rental process safely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Your Property Portfolio Section */}
      <section className="portfolio-section">
        <div className="container">
          <div className="section-header-row">
            <div className="section-title-wrap">
              <h2>Your Property Portfolio</h2>
              <p>Manage and track all your properties in one place.</p>
            </div>
            <Link to="/dashboard" className="section-view-all">
              <span>View All Properties</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Properties Grid */}
          <div className="properties-grid">
            {portfolioProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onManage={(prop) => {
                  setSelectedProperty(prop);
                }}
                onSelect={(prop) => {
                  setSelectedProperty(prop);
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandlordHome;
