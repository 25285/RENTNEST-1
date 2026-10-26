import React, { useState } from 'react';
import { Plus, Building2, CheckCircle2, Clock, IndianRupee, Mail, Eye, Edit3, Trash2, RefreshCw, Phone, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandlordDashboard = () => {
  const {
    properties,
    inquiries,
    deleteProperty,
    togglePropertyStatus,
    setEditingProperty,
    setIsAddModalOpen,
    setSelectedProperty,
    showToast
  } = useAuth();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculations
  const totalProperties = properties.length;
  const availableCount = properties.filter(p => p.status === 'Available').length;
  const occupiedCount = properties.filter(p => p.status === 'Occupied').length;
  
  // Total rental income from currently occupied properties
  const occupiedIncome = properties
    .filter(p => p.status === 'Occupied')
    .reduce((sum, p) => sum + Number(p.price || 0), 0);
  
  // Potential monthly income from all properties
  const totalPotentialIncome = properties
    .reduce((sum, p) => sum + Number(p.price || 0), 0);

  // Filter properties for the table
  const filteredProperties = properties.filter(p => {
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    }
    return true;
  });

  const handleEdit = (prop) => {
    setEditingProperty(prop);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProperty(id);
    }
  };

  const handleReplyInquiry = (inq) => {
    showToast(`Replied to ${inq.tenantName}! Notification sent via WhatsApp & Email.`);
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title-wrap">
            <h1>Landlord Management Dashboard</h1>
            <p>Monitor your active rental listings, tenant leads, and monthly revenue performance.</p>
          </div>

          <button
            onClick={() => {
              setEditingProperty(null);
              setIsAddModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add New Property</span>
          </button>
        </div>

        {/* 1. Stat Counter Cards Grid */}
        <div className="stat-cards-grid">
          {/* Metric 1 */}
          <div className="stat-metric-card">
            <div className="stat-metric-icon green">
              <Building2 size={24} />
            </div>
            <div className="stat-metric-info">
              <h3>{totalProperties}</h3>
              <p>Total Properties</p>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="stat-metric-card">
            <div className="stat-metric-icon blue">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-metric-info">
              <h3>{availableCount}</h3>
              <p>Active Listings ({occupiedCount} Occupied)</p>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="stat-metric-card">
            <div className="stat-metric-icon peach">
              <IndianRupee size={24} />
            </div>
            <div className="stat-metric-info">
              <h3>₹{occupiedIncome.toLocaleString('en-IN')}</h3>
              <p>Monthly Rent Collected</p>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="stat-metric-card">
            <div className="stat-metric-icon purple">
              <Mail size={24} />
            </div>
            <div className="stat-metric-info">
              <h3>{inquiries.length}</h3>
              <p>Tenant Inquiries Received</p>
            </div>
          </div>
        </div>

        {/* 2. Interactive Listing Management Table */}
        <div className="dashboard-main-section">
          {/* Toolbar */}
          <div className="dashboard-toolbar">
            <div className="filter-tabs-group">
              {['All', 'Available', 'Occupied'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`filter-tab-btn ${statusFilter === tab ? 'active' : ''}`}
                >
                  {tab} ({tab === 'All' ? totalProperties : tab === 'Available' ? availableCount : occupiedCount})
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Search listing by name or location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ padding: '8px 14px', width: '280px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Property Details</th>
                  <th>Type</th>
                  <th>Monthly Rent</th>
                  <th>Status</th>
                  <th>Performance</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map(property => (
                    <tr key={property.id}>
                      {/* Property cell */}
                      <td>
                        <div className="table-property-cell">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="table-thumb"
                          />
                          <div>
                            <div className="table-prop-title">{property.title}</div>
                            <div className="table-prop-loc">{property.location}</div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>
                        {property.type}
                      </td>

                      {/* Rent */}
                      <td>
                        <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>
                          ₹{Number(property.price).toLocaleString('en-IN')}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}> /mo</span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`status-badge ${property.status.toLowerCase()}`} style={{ position: 'static' }}>
                          {property.status}
                        </span>
                      </td>

                      {/* Performance */}
                      <td>
                        <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', color: '#64748B' }}>
                          <span title="Views today">👁️ {property.viewsToday || 10}</span>
                          <span title="Inquiries">✉️ {property.inquiries || 0}</span>
                          <span title="Shortlisted">👤 {property.shortlisted || 0}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setSelectedProperty(property)}
                            className="btn-action-icon"
                            title="Preview Listing"
                          >
                            <ExternalLink size={15} />
                          </button>

                          <button
                            onClick={() => togglePropertyStatus(property.id)}
                            className="btn-action-icon toggle-btn"
                            title={`Toggle to ${property.status === 'Available' ? 'Occupied' : 'Available'}`}
                          >
                            <RefreshCw size={15} />
                          </button>

                          <button
                            onClick={() => handleEdit(property)}
                            className="btn-action-icon"
                            title="Edit Listing"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            onClick={() => handleDelete(property.id, property.title)}
                            className="btn-action-icon delete-btn"
                            title="Delete Listing"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                      No properties found matching "{searchTerm}" or filter "{statusFilter}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Tenant Inquiries Section */}
        <div className="inquiries-card" id="inquiries">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                Recent Tenant Inquiries ({inquiries.length})
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '2px' }}>
                Prospective verified tenants looking to lease your homes.
              </p>
            </div>
          </div>

          <div className="inquiry-list">
            {inquiries.map((inq) => (
              <div key={inq.id} className="inquiry-item">
                <div className="inquiry-sender">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h4>{inq.tenantName}</h4>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: inq.status === 'New' ? '#DCFCE7' : '#F1F5F9',
                      color: inq.status === 'New' ? '#15803D' : '#64748B'
                    }}>
                      {inq.status}
                    </span>
                  </div>

                  <div className="inquiry-property-tag">
                    Interested in: {inq.propertyTitle}
                  </div>

                  <p className="inquiry-msg">"{inq.message}"</p>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.8rem', color: '#64748B' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={13} color="#0C7A59" /> {inq.tenantPhone}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={13} color="#0C7A59" /> {inq.tenantEmail}
                    </span>
                  </div>
                </div>

                <div className="inquiry-meta">
                  <span className="inquiry-time">{inq.date}</span>
                  <button
                    onClick={() => handleReplyInquiry(inq)}
                    className="btn-primary"
                    style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                  >
                    <span>Reply to Lead</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
