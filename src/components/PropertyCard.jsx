import React, { useState } from 'react';
import { Heart, MapPin, Eye, Mail, Users, ArrowRight, MoreHorizontal, Bed, Bath, Maximize2, CheckCircle2, Trash2, Edit3, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PropertyCard = ({ property, onManage, onSelect }) => {
  const { userRole, favorites, toggleFavorite, togglePropertyStatus, deleteProperty, setEditingProperty, setIsAddModalOpen, openPropertyWithLoading } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isFavorited = favorites.includes(property.id);

  const handleSelectProperty = (e) => {
    if (userRole === 'landlord') {
      if (onManage) onManage(property);
      else if (onSelect) onSelect(property);
    } else {
      if (onSelect) {
        onSelect(property);
      } else if (openPropertyWithLoading) {
        openPropertyWithLoading(property);
      }
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsLiking(true);
    toggleFavorite(property.id);
    setTimeout(() => setIsLiking(false), 500);
  };

  const handleMenuAction = (action, e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (action === 'toggle') {
      togglePropertyStatus(property.id);
    } else if (action === 'edit') {
      setEditingProperty(property);
      setIsAddModalOpen(true);
    } else if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete "${property.title}"?`)) {
        deleteProperty(property.id);
      }
    }
  };

  return (
    <div
      className="property-card"
      onClick={handleSelectProperty}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelectProperty(e);
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* Image Thumbnail Box */}
      <div className="card-image-box">
        <img
          src={property.image}
          alt={property.title}
          className="property-thumb"
          loading="lazy"
        />

        {/* Status Badge with Live Pulsing Dot */}
        <span className={`status-badge ${property.status.toLowerCase()}`}>
          {property.status}
        </span>

        {/* Animated Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`favorite-btn ${isFavorited ? 'favorited' : ''} ${isLiking ? 'animating-pop' : ''}`}
          title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart size={18} fill={isFavorited ? "#EF4444" : "none"} stroke={isFavorited ? "#EF4444" : "currentColor"} />
        </button>
      </div>

      {/* Card Details Body */}
      <div className="card-body">
        <h3 className="card-title">{property.title}</h3>
        <p className="card-location">
          <MapPin size={15} color="#0C7A59" />
          <span>{property.location}</span>
        </p>

        {/* Price Row */}
        <div className="card-price-row">
          <span className="card-price-value">₹ {Number(property.price).toLocaleString('en-IN')}</span>
          <span className="card-price-term">/ month</span>
        </div>

        {/* Landlord View Metrics Bar */}
        {userRole === 'landlord' ? (
          <>
            <div className="card-stats-bar">
              <span className="card-stat-item" title="Views today">
                <Eye size={14} color="#0C7A59" />
                <span>{property.viewsToday || 12} views</span>
              </span>
              <span className="card-stat-item" title="Direct inquiries">
                <Mail size={14} color="#2563EB" />
                <span>{property.inquiries || 0} inquiries</span>
              </span>
              <span className="card-stat-item" title="Shortlisted by tenants">
                <Users size={14} color="#7C3AED" />
                <span>{property.shortlisted || 0} shortlisted</span>
              </span>
            </div>

            {/* Actions Row */}
            <div className="card-actions-row" style={{ position: 'relative' }}>
              <button
                onClick={() => onManage ? onManage(property) : onSelect(property)}
                className="btn-card-manage"
              >
                <span>Manage Listing</span>
                <ArrowRight size={15} />
              </button>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="btn-card-more"
                  title="More actions"
                >
                  <MoreHorizontal size={18} />
                </button>

                {showMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '50px',
                      right: 0,
                      background: '#FFFFFF',
                      borderRadius: '14px',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.18)',
                      border: '1px solid #E2E8F0',
                      padding: '8px',
                      zIndex: 30,
                      minWidth: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      animation: 'modalSpringPop 0.25s ease'
                    }}
                  >
                    <button
                      onClick={(e) => handleMenuAction('toggle', e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#0D1B2A',
                        borderRadius: '8px',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <RefreshCw size={15} color="#0C7A59" />
                      <span>Mark as {property.status === 'Available' ? 'Occupied' : 'Available'}</span>
                    </button>

                    <button
                      onClick={(e) => handleMenuAction('edit', e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#0D1B2A',
                        borderRadius: '8px',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Edit3 size={15} color="#2563EB" />
                      <span>Edit Specifications</span>
                    </button>

                    <button
                      onClick={(e) => handleMenuAction('delete', e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#DC2626',
                        borderRadius: '8px',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Trash2 size={15} color="#DC2626" />
                      <span>Delete Listing</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Tenant View Specs and Action */
          <>
            <div className="card-specs-row">
              <span className="spec-item">
                <Bed size={15} color="#0C7A59" />
                <span>{property.bedrooms || 2} Beds</span>
              </span>
              <span className="spec-item">
                <Bath size={15} color="#0C7A59" />
                <span>{property.bathrooms || 2} Baths</span>
              </span>
              <span className="spec-item">
                <Maximize2 size={15} color="#0C7A59" />
                <span>{property.area || 1200} sq.ft</span>
              </span>
            </div>

            <div className="card-actions-row">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectProperty(e);
                }}
                className="btn-card-manage"
                style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-light)' }}
              >
                <span>View Details & Connect</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
