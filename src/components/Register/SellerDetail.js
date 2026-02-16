import React, { useState } from "react";
import "./Register.css";

const SellerDetail = () => {
  const [details, setDetails] = useState({
    businessType: "",
    gstNumber: "",
    panNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    bankAccountNumber: "",
    bankName: "",
    ifscCode: "",
    upiId: "",
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Seller details submitted: ", details);
    alert("Seller details saved! You can now login.");
  };

  return (
    <div className="register-container">
      <h2>Complete Your Business Details</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <select name="businessType" required onChange={handleChange}>
          <option value="">Select Business Type</option>
          <option value="individual">Individual</option>
          <option value="company">Company</option>
        </select>
        <input type="text" name="gstNumber" placeholder="GST Number (optional)" onChange={handleChange} />
        <input type="text" name="panNumber" placeholder="PAN Number" onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <input type="text" name="city" placeholder="City" onChange={handleChange} />
        <input type="text" name="state" placeholder="State" onChange={handleChange} />
        <input type="text" name="country" placeholder="Country" onChange={handleChange} />
        <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} />
        <input type="text" name="bankAccountNumber" placeholder="Bank Account Number" onChange={handleChange} />
        <input type="text" name="bankName" placeholder="Bank Name" onChange={handleChange} />
        <input type="text" name="ifscCode" placeholder="IFSC Code" onChange={handleChange} />
        <input type="text" name="upiId" placeholder="UPI ID" onChange={handleChange} />
        <button type="submit">Save Details</button>
      </form>
    </div>
  );
};

export default SellerDetail;
