import React, { useState } from 'react';
import { 
  FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaCheck, FaLock, 
  FaUser, FaBuilding, FaEnvelope, FaPhone, FaMapMarker, FaCreditCard, 
  FaUniversity, FaFileInvoice, FaIdCard, FaCity, FaMapMarkedAlt, 
  FaGlobe, FaMapPin, FaWallet 
} from 'react-icons/fa';
import './Register.css';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    
    // Step 2: Business Details
    businessType: 'individual',
    gstNumber: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
    upiId: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    
    // Check for complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const complexityScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
      .filter(Boolean).length;
    
    if (complexityScore >= 3 && password.length >= 8) return 'strong';
    if (complexityScore >= 2 && password.length >= 6) return 'medium';
    return 'weak';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    
    if (!formData.businessName.trim()) {
      setError('Please enter your business name');
      return false;
    }
    
    if (!formData.password) {
      setError('Please create a password');
      return false;
    }
    
    if (passwordStrength === 'weak') {
      setError('Please choose a stronger password');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/seller/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Please login to continue.');
        setTimeout(() => {
          onRegisterSuccess();
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Basic Information
  const renderStep1 = () => (
    <>
      <div className="form-header">
        <h2>Create Seller Account</h2>
        <p>Join thousands of sellers growing their business with us</p>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{width: '33%'}}></div>
        </div>
        <div className="progress-steps">
          <span className="progress-step active">1</span>
          <span className="progress-step">2</span>
        </div>
        <div className="progress-labels">
          <span className="progress-label active">Basic Info</span>
          <span className="progress-label">Business Details</span>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="input-group">
        <div className="input-icon">
          <FaUser />
        </div>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
      </div>
      
      <div className="input-group">
        <div className="input-icon">
          <FaBuilding />
        </div>
        <input
          type="text"
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Business Name"
          required
        />
      </div>
      
      <div className="form-row">
        <div className="input-group">
          <div className="input-icon">
            <FaEnvelope />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
        </div>
        
        <div className="input-group">
          <div className="input-icon">
            <FaPhone />
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
        </div>
      </div>
      
      <div className="input-group">
        <div className="input-icon">
          <FaLock />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button 
          type="button" 
          className="password-toggle"
          onClick={() => togglePasswordVisibility('password')}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        
        {formData.password && (
          <>
            <div className="password-strength">
              <div className={`strength-meter ${passwordStrength}`}>
                <div className="strength-text">
                  {passwordStrength === 'weak' && 'Weak password'}
                  {passwordStrength === 'medium' && 'Medium strength'}
                  {passwordStrength === 'strong' && 'Strong password'}
                </div>
              </div>
            </div>
            <div className="password-requirements">
              <div className={`requirement ${formData.password.length >= 8 ? 'met' : ''}`}>
                <FaCheck /> At least 8 characters
              </div>
              <div className={`requirement ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'met' : ''}`}>
                <FaCheck /> Uppercase & lowercase letters
              </div>
              <div className={`requirement ${/\d/.test(formData.password) && /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'met' : ''}`}>
                <FaCheck /> Numbers & special characters
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="input-group">
        <div className="input-icon">
          <FaLock />
        </div>
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />
        <button 
          type="button" 
          className="password-toggle"
          onClick={() => togglePasswordVisibility('confirm')}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      
      <div className="form-actions">
        <button 
          type="button" 
          className="btn-next"
          onClick={handleNextStep}
        >
          Continue <FaArrowRight />
        </button>
        
        <div className="auth-redirect">
          Already have an account? <button type="button" onClick={onSwitchToLogin}>Sign In</button>
        </div>
      </div>
      
      <div className="terms-notice">
        By continuing, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
      </div>
    </>
  );

  // Step 2: Business Details
  const renderStep2 = () => (
    <>
      <div className="form-header">
        <h2>Business Details</h2>
        <p>Complete your seller profile with business information</p>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{width: '100%'}}></div>
        </div>
        <div className="progress-steps">
          <span className="progress-step completed">1</span>
          <span className="progress-step active">2</span>
        </div>
        <div className="progress-labels">
          <span className="progress-label completed">Basic Info</span>
          <span className="progress-label active">Business Details</span>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="input-group">
        <div className="input-icon">
          <FaBuilding />
        </div>
        <select
          id="businessType"
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          required
        >
          <option value="individual">Individual</option>
          <option value="partnership">Partnership</option>
          <option value="private-limited">Private Limited</option>
          <option value="llp">LLP (Limited Liability Partnership)</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="form-row">
        <div className="input-group">
          <div className="input-icon">
            <FaFileInvoice />
          </div>
          <input
            type="text"
            id="gstNumber"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="GST Number (Optional)"
          />
        </div>
        
        <div className="input-group">
          <div className="input-icon">
            <FaIdCard />
          </div>
          <input
            type="text"
            id="panNumber"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            placeholder="PAN Number (Optional)"
          />
        </div>
      </div>
      
      <div className="input-group">
        <div className="input-icon">
          <FaMapMarker />
        </div>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Business Address"
          required
        />
      </div>
      
      <div className="form-row">
        <div className="input-group">
          <div className="input-icon">
            <FaCity />
          </div>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
        </div>
        
        <div className="input-group">
          <div className="input-icon">
            <FaMapMarkedAlt />
          </div>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            required
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="input-group">
          <div className="input-icon">
            <FaGlobe />
          </div>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            required
          />
        </div>
        
        <div className="input-group">
          <div className="input-icon">
            <FaMapPin />
          </div>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            required
          />
        </div>
      </div>
      
      <div className="section-divider">
        <span>Bank Account Details</span>
      </div>
      
      <div className="input-group">
        <div className="input-icon">
          <FaCreditCard />
        </div>
        <input
          type="text"
          id="bankAccountNumber"
          name="bankAccountNumber"
          value={formData.bankAccountNumber}
          onChange={handleChange}
          placeholder="Bank Account Number"
          required
        />
      </div>
      
      <div className="form-row">
        <div className="input-group">
          <div className="input-icon">
            <FaUniversity />
          </div>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="Bank Name"
            required
          />
        </div>
        
        <div className="input-group">
          <div className="input-icon">
            <FaUniversity />
          </div>
          <input
            type="text"
            id="ifscCode"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            placeholder="IFSC Code"
            required
          />
        </div>
      </div>
      
      <div className="input-group">
        <div className="input-icon">
          <FaWallet />
        </div>
        <input
          type="text"
          id="upiId"
          name="upiId"
          value={formData.upiId}
          onChange={handleChange}
          placeholder="UPI ID (Optional)"
        />
      </div>
      
      <div className="form-actions">
        <button 
          type="button" 
          className="btn-previous"
          onClick={handlePreviousStep}
        >
          <FaArrowLeft /> Back
        </button>
        
        <button 
          type="submit" 
          className="btn-register" 
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </div>
      
      <div className="terms-notice">
        By registering, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
      </div>
    </>
  );

  return (
    <div className="register-container">
      <div className="register-card">
        <form className="register-form" onSubmit={handleSubmit}>
          {step === 1 ? renderStep1() : renderStep2()}
        </form>
      </div>
    </div>
  );
};

export default Register;