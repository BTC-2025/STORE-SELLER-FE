import React, { useState, useEffect } from 'react';
import './SellerProfile.css';
import { FaUser, FaEnvelope, FaPhone, FaStore, FaFileInvoiceDollar, 
         FaMapMarkerAlt, FaCity, FaGlobe, FaMailBulk, FaUniversity, 
         FaCreditCard, FaCheckCircle, FaTimesCircle, FaEdit } from 'react-icons/fa';

const SellerProfile = ({ sellerToken, onBackToDashboard }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/seller/ownprofile`, {
          headers: {
            'Authorization': `Bearer ${sellerToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        setProfileData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [sellerToken]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
        <button onClick={onBackToDashboard}>Back to Dashboard</button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-error">
        <h3>No Profile Data</h3>
        <p>Unable to load profile information.</p>
        <button onClick={onBackToDashboard}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="seller-profile">
      <div className="profile-header">
        <button className="btn-back" onClick={onBackToDashboard}>
          &larr; Back to Dashboard
        </button>
        <h1>Seller Profile</h1>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header-card">
            <div className="profile-avatar">
              <FaUser />
            </div>
            <div className="profile-info">
              <h2>{profileData.name}</h2>
              <p className="profile-email">{profileData.email}</p>
              <div className="status-badges">
                <span className={`status-badge ${profileData.status}`}>
                  {profileData.status}
                </span>
                <span className={`status-badge ${profileData.isVerified ? 'verified' : 'not-verified'}`}>
                  {profileData.isVerified ? 'Verified' : 'Not Verified'}
                </span>
                <span className={`status-badge ${profileData.kycStatus}`}>
                  KYC: {profileData.kycStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-details">
            <div className="details-section">
              <h3>Personal Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaUser />
                  </div>
                  <div className="detail-content">
                    <label>Full Name</label>
                    <p>{profileData.name}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaEnvelope />
                  </div>
                  <div className="detail-content">
                    <label>Email Address</label>
                    <p>{profileData.email}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaPhone />
                  </div>
                  <div className="detail-content">
                    <label>Phone Number</label>
                    <p>{profileData.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>Business Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaStore />
                  </div>
                  <div className="detail-content">
                    <label>Business Name</label>
                    <p>{profileData.businessName}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaFileInvoiceDollar />
                  </div>
                  <div className="detail-content">
                    <label>Business Type</label>
                    <p>{profileData.businessType || 'Not specified'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaFileInvoiceDollar />
                  </div>
                  <div className="detail-content">
                    <label>GST Number</label>
                    <p>{profileData.gstNumber || 'Not provided'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaFileInvoiceDollar />
                  </div>
                  <div className="detail-content">
                    <label>PAN Number</label>
                    <p>{profileData.panNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>Address Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="detail-content">
                    <label>Address</label>
                    <p>{profileData.address || 'Not provided'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaCity />
                  </div>
                  <div className="detail-content">
                    <label>City</label>
                    <p>{profileData.city || 'Not provided'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaGlobe />
                  </div>
                  <div className="detail-content">
                    <label>State</label>
                    <p>{profileData.state || 'Not provided'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaGlobe />
                  </div>
                  <div className="detail-content">
                    <label>Country</label>
                    <p>{profileData.country || 'Not provided'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaMailBulk />
                  </div>
                  <div className="detail-content">
                    <label>Pincode</label>
                    <p>{profileData.pincode || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>Banking Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaUniversity />
                  </div>
                  <div className="detail-content">
                    <label>Bank Name</label>
                    <p>{profileData.bankName || 'Not provided'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaCreditCard />
                  </div>
                  <div className="detail-content">
                    <label>Account Number</label>
                    <p>{profileData.bankAccountNumber ? '••••••••' + profileData.bankAccountNumber.slice(-4) : 'Not provided'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaCreditCard />
                  </div>
                  <div className="detail-content">
                    <label>IFSC Code</label>
                    <p>{profileData.ifscCode || 'Not provided'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaCreditCard />
                  </div>
                  <div className="detail-content">
                    <label>UPI ID</label>
                    <p>{profileData.upiId || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>Account Status</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    {profileData.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                  </div>
                  <div className="detail-content">
                    <label>Account Status</label>
                    <p>{profileData.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    {profileData.isBlocked ? <FaTimesCircle /> : <FaCheckCircle />}
                  </div>
                  <div className="detail-content">
                    <label>Block Status</label>
                    <p>{profileData.isBlocked ? 'Blocked' : 'Not Blocked'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaFileInvoiceDollar />
                  </div>
                  <div className="detail-content">
                    <label>Payment Status</label>
                    <p>{profileData.paymentStatus}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <FaFileInvoiceDollar />
                  </div>
                  <div className="detail-content">
                    <label>Member Since</label>
                    <p>{new Date(profileData.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-edit-profile">
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;