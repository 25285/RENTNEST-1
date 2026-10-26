import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Home, IndianRupee, ShieldCheck, CheckCircle2, UserCheck, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { quickLocations, propertyTypes, sampleTestimonials } from '../data/mockData';

const TenantHome = () => {
  const { properties, setSelectedProperty, openPropertyWithLoading } = useAuth();
  const navigate = useNavigate();

  // Search state
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedBudget, setSelectedBudget] = useState('any');
  const [activePill, setActivePill] = useState('All Homes');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/browse?location=${encodeURIComponent(selectedLocation)}&type=${encodeURIComponent(selectedType)}&budget=${selectedBudget}`);
  };

  const handlePillClick = (pill) => {
    setActivePill(pill);
    if (pill === 'All Homes') {
      setSelectedBudget('any');
      setSelectedType('All Types');
    } else if (pill === 'Under ₹20,000') {
      setSelectedBudget('20000');
    } else if (pill === '2 BHK') {
      setSelectedType('2 BHK Apartment');
    } else if (pill === '3 BHK') {
      setSelectedType('3 BHK Independent House');
    } else if (pill === 'Hyderabad') {
      setSelectedLocation('Gachibowli, Hyderabad');
    } else if (pill === 'Bangalore') {
      setSelectedLocation('Whitefield, Bangalore');
    }
  };

  // Filter properties based on current selections
  const filteredProperties = properties.filter((prop) => {
    const matchesStatus = prop.status === 'Available';
    const matchesLoc = selectedLocation === 'All Locations' || prop.location.toLowerCase().includes(selectedLocation.split(',')[0].toLowerCase());
    const matchesType = selectedType === 'All Types' || prop.type.toLowerCase().includes(selectedType.toLowerCase().split(' ')[0]);
    const matchesBudget = selectedBudget === 'any' || (selectedBudget === '20000' ? prop.price <= 20000 : selectedBudget === '30000' ? prop.price <= 30000 : prop.price <= Number(selectedBudget));

    return matchesStatus && matchesLoc && matchesType && matchesBudget;
  });

  return (
    <div className="tenant-home-page">
      {/* 1. Tenant Hero Section with Ambient Glow */}
      <section className="tenant-hero-section">
        <div className="hero-ambient-orb orb-emerald" />
        <div className="hero-ambient-orb orb-sky" />

        <div className="container">
          <div className="tenant-hero-content">
            <div className="hero-tag-badge" style={{ margin: '0 auto 20px auto' }}>
              <Sparkles size={14} />
              <span>Verified Direct Rentals • 100% Broker-Free</span>
            </div>

            <h1 className="tenant-hero-title">
              Find Your Dream Rental with <br />
              <span className="highlight">Zero Brokerage Guarantee</span>
            </h1>

            <p className="tenant-hero-subtitle">
              Connect directly with verified property owners, negotiate transparently, and move into your next home effortlessly.
            </p>

            {/* Prominent Search Bar Card with Interactive Focus Effect */}
            <form onSubmit={handleSearchSubmit} className="main-search-card">
              {/* Location Input */}
              <div className="search-field-group">
                <MapPin size={20} className="search-field-icon" />
                <div className="search-input-wrap">
                  <span className="search-label">Location</span>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="search-select"
                  >
                    {quickLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Type Input */}
              <div className="search-field-group">
                <Home size={20} className="search-field-icon" />
                <div className="search-input-wrap">
                  <span className="search-label">Property Type</span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="search-select"
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget Input */}
              <div className="search-field-group">
                <IndianRupee size={20} className="search-field-icon" />
                <div className="search-input-wrap">
                  <span className="search-label">Max Budget</span>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="search-select"
                  >
                    <option value="any">Any Budget</option>
                    <option value="20000">Under ₹20,000</option>
                    <option value="30000">Under ₹30,000</option>
                    <option value="50000">Under ₹50,000</option>
                    <option value="75000">Under ₹75,000</option>
                  </select>
                </div>
              </div>

              {/* Search Submit Button */}
              <button type="submit" className="btn-search-submit">
                <Search size={18} strokeWidth={2.5} />
                <span>Find Homes</span>
              </button>
            </form>

            {/* Quick Filter Pills with Spring Animation */}
            <div className="filter-pills-row">
              {['All Homes', 'Under ₹20,000', '2 BHK', '3 BHK', 'Hyderabad', 'Bangalore'].map((pill) => (
                <button
                  key={pill}
                  onClick={() => handlePillClick(pill)}
                  className={`filter-pill ${activePill === pill ? 'active' : ''}`}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Features Section (3 Pillar Cards with Hover Lift) */}
      <section className="tenant-features-section" id="how-it-works">
        <div className="container">
          <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2>Why Rent on RentNest?</h2>
            <p>Designed from the ground up for transparent, broker-free living.</p>
          </div>

          <div className="features-three-col">
            {/* Pillar 1 */}
            <div className="feature-pillar-card">
              <div className="pillar-icon-box">
                <ShieldCheck size={28} />
              </div>
              <h3>100% Verified Listings</h3>
              <p>Every flat, villa, and apartment is verified with true-to-life photography, verified owner documents, and transparent floor plans.</p>
            </div>

            {/* Pillar 2 */}
            <div className="feature-pillar-card">
              <div className="pillar-icon-box">
                <UserCheck size={28} />
              </div>
              <h3>Direct Landlord Connection</h3>
              <p>Skip middlemen completely. Call, message, and organize in-person site visits directly with registered property owners.</p>
            </div>

            {/* Pillar 3 */}
            <div className="feature-pillar-card">
              <div className="pillar-icon-box">
                <IndianRupee size={28} />
              </div>
              <h3>Zero Brokerage Fees</h3>
              <p>Save 1 to 2 months of hard-earned salary on brokerage commissions. Pay solely your legitimate rent and standard security deposit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Property Grid */}
      <section className="portfolio-section" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="section-header-row">
            <div className="section-title-wrap">
              <h2>Featured Rental Properties</h2>
              <p>Verified homes available for immediate occupancy.</p>
            </div>
            <Link to="/browse" className="section-view-all">
              <span>Explore All ({properties.filter(p => p.status === 'Available').length} Available)</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="properties-grid">
            {(filteredProperties.length > 0 ? filteredProperties.slice(0, 6) : properties.slice(0, 6)).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={(prop) => openPropertyWithLoading(prop)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section with Hover Cards */}
      <section style={{ padding: '64px 0', backgroundColor: 'var(--bg-light)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0C7A59', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Real Stories
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0D1B2A', marginTop: '4px' }}>
              Loved by Tenants & Landlords
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '26px' }}>
            {sampleTestimonials.map((t) => (
              <div
                key={t.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '30px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(13,27,42,0.1)';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <p style={{ fontSize: '0.94rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '22px' }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0C7A59' }}
                  />
                  <div>
                    <h5 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0D1B2A' }}>{t.name}</h5>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{t.role} • {t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TenantHome;
