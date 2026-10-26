import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Maximize2, ShieldCheck, Phone, Mail, Calendar, Send, CheckCircle2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PropertyDetailModal = () => {
  const { selectedProperty, setSelectedProperty, favorites, toggleFavorite, addInquiry, userRole, currentUser } = useAuth();
  
  const [inquiryText, setInquiryText] = useState("Hi! I'm interested in renting this property. Could we schedule a visit this weekend?");
  const [preferredDate, setPreferredDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!selectedProperty) return null;

  const isFavorited = favorites.includes(selectedProperty.id);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    addInquiry({
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title + ', ' + selectedProperty.location,
      message: `${inquiryText} ${preferredDate ? `[Requested Visit Date: ${preferredDate}]` : ''}`,
      tenantName: currentUser.name,
      tenantEmail: currentUser.email,
      tenantPhone: '+91 98450 99887'
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedProperty(null);
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedProperty(null)}>
      <div className="modal-content-card" style={{ maxWidth: '820px' }} onClick={e => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={`status-badge ${selectedProperty.status.toLowerCase()}`} style={{ position: 'static' }}>
              {selectedProperty.status}
            </span>
            <h3 style={{ fontSize: '1.25rem' }}>{selectedProperty.title}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => toggleFavorite(selectedProperty.id)}
              className="btn-action-icon"
              title="Save to Favorites"
            >
              <Heart size={18} fill={isFavorited ? "#EF4444" : "none"} stroke={isFavorited ? "#EF4444" : "currentColor"} />
            </button>
            <button onClick={() => setSelectedProperty(null)} className="modal-close-btn">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '0 0 24px 0' }}>
          {/* Main Hero Photo Banner */}
          <div style={{ position: 'relative', height: '320px', width: '100%', overflow: 'hidden' }}>
            <img
              src={selectedProperty.image}
              alt={selectedProperty.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(180deg, transparent 0%, rgba(13, 27, 42, 0.85) 100%)',
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              color: '#FFFFFF'
            }}>
              <div>
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', opacity: 0.9 }}>
                  <MapPin size={16} color="#34D399" />
                  <span>{selectedProperty.location}</span>
                </p>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                  ₹ {Number(selectedProperty.price).toLocaleString('en-IN')} <span style={{ fontSize: '1rem', fontWeight: 500, opacity: 0.8 }}>/ month</span>
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.82rem', opacity: 0.8 }}>Security Deposit</span>
                <p style={{ fontSize: '1.15rem', fontWeight: 700 }}>₹ {Number(selectedProperty.deposit || selectedProperty.price * 2).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px 28px' }}>
            {/* Quick Specs Pill Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              padding: '16px',
              background: '#F8FAFC',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #E2E8F0',
              textAlign: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Type</span>
                <strong style={{ fontSize: '0.92rem', color: '#0D1B2A' }}>{selectedProperty.type}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Configuration</span>
                <strong style={{ fontSize: '0.92rem', color: '#0D1B2A' }}>{selectedProperty.bedrooms} Beds, {selectedProperty.bathrooms} Baths</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Carpet Area</span>
                <strong style={{ fontSize: '0.92rem', color: '#0D1B2A' }}>{selectedProperty.area} sq.ft</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Furnishing</span>
                <strong style={{ fontSize: '0.92rem', color: '#0D1B2A' }}>{selectedProperty.furnishing || 'Semi-Furnished'}</strong>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '8px' }}>
                About this Home
              </h4>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>
                {selectedProperty.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '12px' }}>
                Amenities & Features
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedProperty.amenities && selectedProperty.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#E6F4EE',
                      color: '#0C7A59',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle2 size={13} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Landlord & Inquiry Section */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1.3fr',
              gap: '24px'
            }}>
              {/* Landlord Contact Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <ShieldCheck size={18} color="#0C7A59" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0C7A59', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Verified Landlord
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '4px' }}>
                  {selectedProperty.landlordName || 'Vikram Patel'}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '16px' }}>
                  Direct Owner • Zero Brokerage Listing
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} color="#0C7A59" />
                    <span>{selectedProperty.landlordPhone || '+91 98450 12345'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} color="#0C7A59" />
                    <span>{selectedProperty.landlordEmail || 'contact@rentnest.in'}</span>
                  </div>
                </div>
              </div>

              {/* Inquiry Form */}
              <div>
                {isSubmitted ? (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    border: '1px solid #DCFCE7'
                  }}>
                    <CheckCircle2 size={36} color="#15803D" style={{ marginBottom: '8px' }} />
                    <h5 style={{ fontSize: '1rem', fontWeight: 700, color: '#15803D' }}>Inquiry Sent Successfully!</h5>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>The owner has been notified and will reach out shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0D1B2A' }}>
                      Send Direct Message / Schedule Visit
                    </label>
                    <textarea
                      rows="3"
                      value={inquiryText}
                      onChange={e => setInquiryText(e.target.value)}
                      className="form-input"
                      style={{ padding: '10px 12px', fontSize: '0.85rem' }}
                      required
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={e => setPreferredDate(e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 12px', fontSize: '0.82rem', flex: 1 }}
                        title="Preferred Visit Date"
                      />
                      <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                        <Send size={14} />
                        <span>Connect</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailModal;
