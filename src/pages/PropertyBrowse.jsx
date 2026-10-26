import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, ArrowUpDown, SlidersHorizontal, RotateCcw, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import { quickLocations, propertyTypes } from '../data/mockData';

const PropertyBrowse = () => {
  const { properties, setSelectedProperty, favorites, openPropertyWithLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states initialized from URL params
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || 'All Locations');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'All Types');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('budget') && searchParams.get('budget') !== 'any' ? Number(searchParams.get('budget')) : 80000);
  const [furnishingFilter, setFurnishingFilter] = useState('All');
  const [onlyFavorites, setOnlyFavorites] = useState(searchParams.get('filter') === 'favorites');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    if (searchParams.get('filter') === 'favorites') {
      setOnlyFavorites(true);
    }
  }, [searchParams]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationFilter('All Locations');
    setTypeFilter('All Types');
    setMaxPrice(80000);
    setFurnishingFilter('All');
    setOnlyFavorites(false);
    setSortBy('featured');
    setSearchParams({});
  };

  // Filter logic
  const filteredList = properties.filter((item) => {
    // Only available or favorites
    if (onlyFavorites) {
      if (!favorites.includes(item.id)) return false;
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = item.title.toLowerCase().includes(q) ||
                    item.location.toLowerCase().includes(q) ||
                    item.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (locationFilter !== 'All Locations') {
      const locKey = locationFilter.split(',')[0].trim().toLowerCase();
      if (!item.location.toLowerCase().includes(locKey)) return false;
    }

    if (typeFilter !== 'All Types') {
      const typeKey = typeFilter.toLowerCase().split(' ')[0];
      if (!item.type.toLowerCase().includes(typeKey)) return false;
    }

    if (furnishingFilter !== 'All') {
      if (item.furnishing !== furnishingFilter) return false;
    }

    if (item.price > maxPrice) return false;

    return true;
  });

  // Sort logic
  const sortedList = [...filteredList].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'views') return (b.viewsToday || 0) - (a.viewsToday || 0);
    return 0; // default order
  });

  return (
    <div className="property-browse-page" style={{ padding: '36px 0 60px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark-navy)', letterSpacing: '-0.5px' }}>
              {onlyFavorites ? 'Your Saved Favorite Homes' : 'Explore Rental Properties'}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Showing {sortedList.length} verified listings ready for lease
            </p>
          </div>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`btn-outline ${onlyFavorites ? 'active' : ''}`}
            style={{
              borderColor: onlyFavorites ? '#EF4444' : '#E2E8F0',
              color: onlyFavorites ? '#EF4444' : 'var(--dark-navy)',
              backgroundColor: onlyFavorites ? '#FFF5F5' : '#FFFFFF'
            }}
          >
            <Heart size={16} fill={onlyFavorites ? "#EF4444" : "none"} stroke="#EF4444" />
            <span>{onlyFavorites ? 'Showing Favorites Only' : `Favorites (${favorites.length})`}</span>
          </button>
        </div>

        {/* Filters Toolbar */}
        <div style={{
          background: 'var(--white)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px'
        }}>
          {/* Top Search Input */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                placeholder="Search by area, landmark, society name, or features..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '42px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="form-input"
                style={{ padding: '10px 14px', width: 'auto' }}
              >
                <option value="featured">Featured / Newest</option>
                <option value="price-asc">Rent: Low to High</option>
                <option value="price-desc">Rent: High to Low</option>
                <option value="views">Most Popular</option>
              </select>

              <button
                onClick={handleResetFilters}
                className="btn-outline"
                style={{ padding: '10px 14px' }}
                title="Reset all filters"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Secondary Filters Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Location
              </label>
              <select
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px' }}
              >
                {quickLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Property Type
              </label>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px' }}
              >
                {propertyTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Furnishing
              </label>
              <select
                value={furnishingFilter}
                onChange={e => setFurnishingFilter(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px' }}
              >
                <option value="All">All Furnishings</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Max Rent
                </label>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0C7A59' }}>
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="80000"
                step="5000"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0C7A59', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {sortedList.length > 0 ? (
          <div className="properties-grid">
            {sortedList.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={prop => openPropertyWithLoading(prop)}
              />
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--white)',
            borderRadius: '16px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Search size={48} color="#94A3B8" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D1B2A', marginBottom: '8px' }}>
              No properties matched your criteria
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', maxWidth: '440px', margin: '0 auto 20px auto' }}>
              Try adjusting your rent slider, changing the location filter, or clearing your search keywords.
            </p>
            <button onClick={handleResetFilters} className="btn-primary" style={{ margin: '0 auto' }}>
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyBrowse;
