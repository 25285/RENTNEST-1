import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, IndianRupee, Image, FileText, Check, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { propertyTypes } from '../data/mockData';

const presetImages = [
  { label: 'Modern Living Room', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Luxury Villa', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Urban Apartment', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Suburban House', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Cozy Bedroom Flat', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80' }
];

const allAmenities = [
  "Swimming Pool", "Gymnasium", "24/7 Security", "Covered Car Parking",
  "Power Backup", "Clubhouse", "Elevator", "High-speed WiFi",
  "Pet Friendly", "Balcony", "Private Garden", "RO Water Purifier"
];

const AddPropertyModal = () => {
  const { isAddModalOpen, setIsAddModalOpen, addProperty, editProperty, editingProperty, setEditingProperty } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    city: 'Hyderabad',
    price: '',
    deposit: '',
    type: '2 BHK Apartment',
    status: 'Available',
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    furnishing: 'Semi-Furnished',
    description: '',
    image: presetImages[0].url,
    amenities: ['24/7 Security', 'Covered Car Parking', 'Power Backup']
  });

  useEffect(() => {
    if (editingProperty) {
      setFormData({
        title: editingProperty.title || '',
        location: editingProperty.location || '',
        city: editingProperty.city || 'Hyderabad',
        price: editingProperty.price || '',
        deposit: editingProperty.deposit || '',
        type: editingProperty.type || '2 BHK Apartment',
        status: editingProperty.status || 'Available',
        bedrooms: editingProperty.bedrooms || 2,
        bathrooms: editingProperty.bathrooms || 2,
        area: editingProperty.area || 1200,
        furnishing: editingProperty.furnishing || 'Semi-Furnished',
        description: editingProperty.description || '',
        image: editingProperty.image || presetImages[0].url,
        amenities: editingProperty.amenities || []
      });
    } else {
      setFormData({
        title: '',
        location: 'Gachibowli, Hyderabad',
        city: 'Hyderabad',
        price: '25000',
        deposit: '50000',
        type: '2 BHK Apartment',
        status: 'Available',
        bedrooms: 2,
        bathrooms: 2,
        area: 1250,
        furnishing: 'Semi-Furnished',
        description: 'Modern, well-lit apartment with modular kitchen, premium fixtures, and panoramic city views in a gated community.',
        image: presetImages[0].url,
        amenities: ['24/7 Security', 'Covered Car Parking', 'Power Backup', 'Gymnasium']
      });
    }
  }, [editingProperty, isAddModalOpen]);

  if (!isAddModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.price) {
      alert('Please fill in the required fields: Title, Location, and Rent');
      return;
    }

    if (editingProperty) {
      editProperty(editingProperty.id, formData);
    } else {
      addProperty(formData);
    }

    setIsAddModalOpen(false);
    setEditingProperty(null);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingProperty(null);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{editingProperty ? 'Edit Property Listing' : 'List a New Property'}</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
              {editingProperty ? 'Update details and pricing for this listing' : 'Fill in the specifications to publish your property to verified tenants'}
            </p>
          </div>
          <button onClick={closeModal} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="modal-body">
            {/* Title & Type */}
            <div className="form-grid-2">
              <div className="form-group">
                <label>Property Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="e.g. 2 BHK Modern Apartment"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Property Type *</label>
                <select
                  name="type"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  value={formData.type}
                  onChange={handleChange}
                >
                  {propertyTypes.filter(t => t !== 'All Types').map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location & City */}
            <div className="form-grid-2">
              <div className="form-group">
                <label>Location & Landmark *</label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="e.g. Gachibowli, Hyderabad"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Availability Status *</label>
                <select
                  name="status"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Available">Available for Rent</option>
                  <option value="Occupied">Currently Occupied</option>
                </select>
              </div>
            </div>

            {/* Price & Deposit */}
            <div className="form-grid-3">
              <div className="form-group">
                <label>Monthly Rent (₹) *</label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="25000"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Security Deposit (₹)</label>
                <input
                  type="number"
                  name="deposit"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="50000"
                  value={formData.deposit}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Furnishing Status</label>
                <select
                  name="furnishing"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  value={formData.furnishing}
                  onChange={handleChange}
                >
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            {/* Bedrooms, Bathrooms, Sqft */}
            <div className="form-grid-3">
              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Carpet Area (sq.ft)</label>
                <input
                  type="number"
                  name="area"
                  className="form-input"
                  style={{ paddingLeft: '14px' }}
                  value={formData.area}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Property Description</label>
              <textarea
                name="description"
                rows="3"
                className="form-input"
                style={{ padding: '12px 14px', resize: 'vertical' }}
                placeholder="Describe key highlights, floor level, road connectivity, power backup..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Image URL & Presets */}
            <div className="form-group">
              <label>Featured Image URL</label>
              <input
                type="url"
                name="image"
                className="form-input"
                style={{ paddingLeft: '14px', marginBottom: '8px' }}
                placeholder="https://..."
                value={formData.image}
                onChange={handleChange}
              />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Quick Presets:</span>
                {presetImages.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: preset.url }))}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: formData.image === preset.url ? '#E6F4EE' : '#F1F5F9',
                      color: formData.image === preset.url ? '#0C7A59' : '#0D1B2A',
                      fontWeight: 600,
                      border: formData.image === preset.url ? '1px solid #0C7A59' : '1px solid #E2E8F0'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Amenities Included</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
                {allAmenities.map(amenity => {
                  const isChecked = formData.amenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: isChecked ? '#E6F4EE' : '#F8FAFC',
                        border: isChecked ? '1px solid #0C7A59' : '1px solid #E2E8F0',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAmenityToggle(amenity)}
                      />
                      <span style={{ color: isChecked ? '#0C7A59' : '#475569', fontWeight: isChecked ? 600 : 500 }}>
                        {amenity}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={closeModal} className="btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>{editingProperty ? 'Save Changes' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;
