import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaExclamationTriangle, FaFilter, FaTimes } from 'react-icons/fa';
import './ComplaintsManagement.css';

const ComplaintsManagement = ({ sellerToken, sellerId, onBackToDashboard }) => {
  const [complaintsOnUs, setComplaintsOnUs] = useState([]);
  const [complaintsByUs, setComplaintsByUs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('onUs');
  const [filterType, setFilterType] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [resolvedBy, setResolvedBy] = useState('');

  // New complaint form state
  const [newComplaint, setNewComplaint] = useState({
    againstUserId: '',
    againstSellerId: '',
    productId: '',
    orderId: '',
    complaintType: '',
    description: '',
    priority: 'Medium'
  });
  const [creatingComplaint, setCreatingComplaint] = useState(false);

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/complaint/sellerid/${sellerId}`, {
          headers: {
            'Authorization': `Bearer ${sellerToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }

        const data = await response.json();
        setComplaintsOnUs(data.complaintOnUs || []);
        setComplaintsByUs(data.complaintByUs || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [sellerToken, sellerId]);

  // Get complaints based on active tab
  const getCurrentComplaints = () => {
    return activeTab === 'onUs' ? complaintsOnUs : complaintsByUs;
  };

  // Filter complaints based on type
  const filteredComplaints = filterType === 'All'
    ? getCurrentComplaints()
    : getCurrentComplaints().filter(complaint => complaint.complaintType === filterType);

  // Get unique complaint types for filter
  const complaintTypes = ['All', ...new Set([
    ...complaintsOnUs.map(complaint => complaint.complaintType),
    ...complaintsByUs.map(complaint => complaint.complaintType)
  ])];

  // Update complaint status
  const updateComplaintStatus = async () => {
    if (!selectedComplaint) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/complaint/update/status/${selectedComplaint.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sellerToken}`
        },
        body: JSON.stringify({
          status: status,
          priority: priority,
          resolvedBy: resolvedBy ? parseInt(resolvedBy) : null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update complaint status');
      }

      // Update the complaint in the local state
      if (activeTab === 'onUs') {
        const updatedComplaints = complaintsOnUs.map(complaint =>
          complaint.id === selectedComplaint.id
            ? {
              ...complaint,
              status: status,
              priority: priority,
              resolvedBy: resolvedBy ? parseInt(resolvedBy) : null
            }
            : complaint
        );
        setComplaintsOnUs(updatedComplaints);
      } else {
        const updatedComplaints = complaintsByUs.map(complaint =>
          complaint.id === selectedComplaint.id
            ? {
              ...complaint,
              status: status,
              priority: priority,
              resolvedBy: resolvedBy ? parseInt(resolvedBy) : null
            }
            : complaint
        );
        setComplaintsByUs(updatedComplaints);
      }

      setSelectedComplaint({
        ...selectedComplaint,
        status: status,
        priority: priority,
        resolvedBy: resolvedBy ? parseInt(resolvedBy) : null
      });
      setUpdatingStatus(false);

      alert('Complaint status updated successfully!');

    } catch (error) {
      console.error('Error updating complaint status:', error);
      setError('Failed to update complaint status');
      setUpdatingStatus(false);
    }
  };

  // Create new complaint
  const createComplaint = async () => {
    setCreatingComplaint(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/complaint/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sellerToken}`
        },
        body: JSON.stringify({
          againstUserId: newComplaint.againstUserId ? parseInt(newComplaint.againstUserId) : null,
          againstSellerId: newComplaint.againstSellerId ? parseInt(newComplaint.againstSellerId) : null,
          productId: newComplaint.productId ? parseInt(newComplaint.productId) : null,
          orderId: newComplaint.orderId ? parseInt(newComplaint.orderId) : null,
          complaintType: newComplaint.complaintType,
          description: newComplaint.description,
          priority: newComplaint.priority
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create complaint');
      }

      const createdComplaint = await response.json();

      // Add the new complaint to the list
      setComplaintsByUs([...complaintsByUs, createdComplaint]);
      setShowCreateModal(false);
      setNewComplaint({
        againstUserId: '',
        againstSellerId: '',
        productId: '',
        orderId: '',
        complaintType: '',
        description: '',
        priority: 'Medium'
      });

      alert('Complaint created successfully!');

    } catch (error) {
      console.error('Error creating complaint:', error);
      setError('Failed to create complaint');
    } finally {
      setCreatingComplaint(false);
    }
  };

  // Open modal with complaint details
  const openComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setStatus(complaint.status);
    setPriority(complaint.priority);
    setResolvedBy(complaint.resolvedBy || '');
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="complaints-loading">
        <div className="loading-spinner"></div>
        <p>Loading complaints...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="complaints-error">
        <p>Error: {error}</p>
        <button onClick={onBackToDashboard}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="complaints-management-container">
      <div className="complaints-header">
        <button className="btn-back" onClick={onBackToDashboard}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h2>Complaints Management</h2>
        <div className="header-actions">
          <div className="filter-section">
            <FaFilter className="filter-icon" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="type-filter"
            >
              {complaintTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {/* {activeTab === 'byUs' && (
            <button 
              className="btn-create-complaint"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus /> Create Complaint
            </button>
          )} */}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="complaints-tabs">
        <button
          className={`tab-button ${activeTab === 'onUs' ? 'active' : ''}`}
          onClick={() => setActiveTab('onUs')}
        >
          Complaints On Us ({complaintsOnUs.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'byUs' ? 'active' : ''}`}
          onClick={() => setActiveTab('byUs')}
        >
          Complaints By Us ({complaintsByUs.length})
        </button>
      </div>

      <div className="complaints-content">
        {filteredComplaints.length === 0 ? (
          <div className="no-complaints">
            <p>No {activeTab === 'onUs' ? 'complaints on us' : 'complaints by us'} found{filterType !== 'All' ? ` with type: ${filterType}` : ''}</p>
          </div>
        ) : (
          <div className="complaints-table-container">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map(complaint => (
                  <tr key={complaint.id}>
                    <td>#{complaint.id}</td>
                    <td>{complaint.complaintType}</td>
                    <td className="description-cell">
                      {complaint.description.length > 100
                        ? `${complaint.description.substring(0, 100)}...`
                        : complaint.description
                      }
                    </td>
                    <td>
                      <span className={`status-badge status-${complaint.status ? complaint.status.toLowerCase() : 'pending'}`}>
                        {complaint.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge priority-${complaint.priority ? complaint.priority.toLowerCase() : 'medium'}`}>
                        {complaint.priority || 'Medium'}
                      </span>
                    </td>
                    <td>{formatDate(complaint.createdAt)}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => openComplaintDetails(complaint)}
                      >
                        <FaExclamationTriangle /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaint Details Modal */}
      {showModal && selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Complaint Details #{selectedComplaint.id}</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="complaint-details">
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedComplaint.complaintType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedComplaint.description}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Raised By:</span>
                  <span className="detail-value">
                    {selectedComplaint.raisedByUserId
                      ? `User #${selectedComplaint.raisedByUserId}`
                      : selectedComplaint.raisedBySellerId
                        ? `Seller #${selectedComplaint.raisedBySellerId}`
                        : 'N/A'
                    }
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Against:</span>
                  <span className="detail-value">
                    {selectedComplaint.againstUserId
                      ? `User #${selectedComplaint.againstUserId}`
                      : selectedComplaint.againstSellerId
                        ? `Seller #${selectedComplaint.againstSellerId}`
                        : 'N/A'
                    }
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Product ID:</span>
                  <span className="detail-value">{selectedComplaint.productId || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Order ID:</span>
                  <span className="detail-value">{selectedComplaint.orderId || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created Date:</span>
                  <span className="detail-value">{formatDate(selectedComplaint.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{formatDate(selectedComplaint.updatedAt)}</span>
                </div>

                {activeTab === 'onUs' && (
                  <div className="status-update-section">
                    <h4>Update Complaint Status</h4>
                    <div className="form-group">
                      <label>Status:</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Priority:</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Resolved By (Seller ID):</label>
                      <input
                        type="number"
                        value={resolvedBy}
                        onChange={(e) => setResolvedBy(e.target.value)}
                        placeholder="Enter your seller ID"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              {activeTab === 'onUs' && (
                <button
                  className="btn-update"
                  onClick={updateComplaintStatus}
                  disabled={updatingStatus}
                >
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Complaint Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Complaint</h3>
              <button
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="create-complaint-form">
                <div className="form-group">
                  <label>Complaint Type:</label>
                  <select
                    value={newComplaint.complaintType}
                    onChange={(e) => setNewComplaint({ ...newComplaint, complaintType: e.target.value })}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Defective Product">Defective Product</option>
                    <option value="Late Delivery">Late Delivery</option>
                    <option value="Wrong Item">Wrong Item</option>
                    <option value="Poor Service">Poor Service</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                    placeholder="Describe your complaint in detail"
                    rows="4"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Priority:</label>
                  <select
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Against User ID (optional):</label>
                  <input
                    type="number"
                    value={newComplaint.againstUserId}
                    onChange={(e) => setNewComplaint({ ...newComplaint, againstUserId: e.target.value })}
                    placeholder="User ID if complaining against a user"
                  />
                </div>
                <div className="form-group">
                  <label>Against Seller ID (optional):</label>
                  <input
                    type="number"
                    value={newComplaint.againstSellerId}
                    onChange={(e) => setNewComplaint({ ...newComplaint, againstSellerId: e.target.value })}
                    placeholder="Seller ID if complaining against a seller"
                  />
                </div>
                <div className="form-group">
                  <label>Product ID (optional):</label>
                  <input
                    type="number"
                    value={newComplaint.productId}
                    onChange={(e) => setNewComplaint({ ...newComplaint, productId: e.target.value })}
                    placeholder="Product ID related to complaint"
                  />
                </div>
                <div className="form-group">
                  <label>Order ID (optional):</label>
                  <input
                    type="number"
                    value={newComplaint.orderId}
                    onChange={(e) => setNewComplaint({ ...newComplaint, orderId: e.target.value })}
                    placeholder="Order ID related to complaint"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-create"
                onClick={createComplaint}
                disabled={creatingComplaint || !newComplaint.complaintType || !newComplaint.description}
              >
                {creatingComplaint ? 'Creating...' : 'Create Complaint'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsManagement;