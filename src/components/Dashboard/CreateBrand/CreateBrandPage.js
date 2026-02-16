import React, { useState } from 'react';
import { FaArrowLeft, FaUpload, FaCheck, FaStar } from 'react-icons/fa';
import './CreateBrandPage.css';

const CreateBrandPage = ({ sellerToken, onBackToDashboard, onBrandCreated }) => {
  const [newBrand, setNewBrand] = useState({
    name: '',
    logo: '',
    description: '',
    isFeatured: false
  });
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!newBrand.name.trim()) {
      newErrors.name = 'Brand name is required';
    } else if (newBrand.name.length < 2) {
      newErrors.name = 'Brand name must be at least 2 characters';
    }

    if (!newBrand.logo.trim()) {
      newErrors.logo = 'Logo URL is required';
    } else if (!isValidUrl(newBrand.logo)) {
      newErrors.logo = 'Please enter a valid URL';
    }

    if (!newBrand.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (newBrand.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleLogoChange = (e) => {
    const url = e.target.value;
    setNewBrand({ ...newBrand, logo: url });

    if (isValidUrl(url)) {
      setLogoPreview(url);
      setErrors({ ...errors, logo: '' });
    } else if (url.trim() === '') {
      setLogoPreview('');
    }
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/seller/brands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sellerToken}`
        },
        body: JSON.stringify([{
          name: newBrand.name.trim(),
          logo: newBrand.logo.trim(),
          description: newBrand.description.trim(),
          isFeatured: newBrand.isFeatured
        }])
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create brand');
      }

      const successMsg = document.querySelector('.cb-success-overlay');
      if (successMsg) successMsg.classList.add('show');

      setTimeout(() => {
        onBrandCreated();
      }, 1500);

    } catch (error) {
      console.error('Error creating brand:', error);
      setErrors({ submit: error.message || 'Failed to create brand. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cb-page">
      {/* Success Overlay */}
      <div className="cb-success-overlay">
        <div className="cb-success-modal">
          <div className="cb-success-icon">
            <FaCheck />
          </div>
          <h3>Brand Created!</h3>
          <p>Your brand has been established successfully.</p>
        </div>
      </div>

      <div className="cb-container">
        {/* Header */}
        <header className="cb-header">
          <button className="cb-back-btn" onClick={onBackToDashboard}>
            <FaArrowLeft /> Back
          </button>
          <div className="cb-title-section">
            <h1>Create New Brand</h1>
          </div>
        </header>

        <div className="cb-simple-container">
          <form onSubmit={handleCreateBrand} className="cb-form">
            <div className="cb-card">
              <div className="cb-card-header">
                <div className="cb-card-icon"><FaStar /></div>
                <h3>Brand Details</h3>
              </div>
              <div className="cb-card-body">
                {/* Name */}
                <div className="cb-form-group">
                  <label>Brand Name</label>
                  <input
                    type="text"
                    value={newBrand.name}
                    onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                    placeholder="e.g. Nike, Apple, Zara"
                    className={errors.name ? 'cb-input error' : 'cb-input'}
                  />
                  {errors.name && <span className="cb-error">{errors.name}</span>}
                </div>

                {/* Description */}
                <div className="cb-form-group">
                  <label>Description</label>
                  <textarea
                    value={newBrand.description}
                    onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                    placeholder="Tell your brand's story..."
                    rows="4"
                    className={errors.description ? 'cb-input error' : 'cb-input'}
                  />
                  <div className="cb-char-count">{newBrand.description.length} chars</div>
                  {errors.description && <span className="cb-error">{errors.description}</span>}
                </div>

                {/* Logo with Preview Inline */}
                <div className="cb-logo-section-simple">
                  <div className="cb-form-group" style={{ flex: 1 }}>
                    <label>Logo URL</label>
                    <input
                      type="url"
                      value={newBrand.logo}
                      onChange={handleLogoChange}
                      placeholder="https://..."
                      className={errors.logo ? 'cb-input error' : 'cb-input'}
                    />
                    {errors.logo && <span className="cb-error">{errors.logo}</span>}
                  </div>

                  <div className={`cb-logo-preview-box-small ${logoPreview ? 'has-image' : ''}`}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" onError={() => setLogoPreview('')} />
                    ) : (
                      <FaUpload />
                    )}
                  </div>
                </div>

                {/* Checkbox */}
                <div className="cb-checkbox-wrapper">
                  <label className="cb-checkbox-label">
                    <input
                      type="checkbox"
                      checked={newBrand.isFeatured}
                      onChange={(e) => setNewBrand({ ...newBrand, isFeatured: e.target.checked })}
                    />
                    <span className="cb-checkmark"></span>
                    <div>
                      <span className="cb-checkbox-title">Feature Brand</span>
                      <span className="cb-checkbox-desc">Boost visibility on homepage</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {errors.submit && <div className="cb-submit-error">{errors.submit}</div>}

            <div className="cb-actions">
              <button type="button" onClick={onBackToDashboard} className="cb-btn-secondary">
                Cancel
              </button>
              <button type="submit" className="cb-btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Brand'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBrandPage;