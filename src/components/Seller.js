import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard/Dashboard";
import Login from "./Login/Login";
import Register from "./Register/Register";

const Seller = () => {
  // Load from localStorage on first render
  const [sellerToken, setSellerToken] = useState(localStorage.getItem("sellerToken"));
  const [sellerData, setSellerData] = useState(
    JSON.parse(localStorage.getItem("sellerData")) || null
  );

  const [showRegister, setShowRegister] = useState(false);

  // Persist state changes into localStorage
  useEffect(() => {
    if (sellerToken && sellerData) {
      localStorage.setItem("sellerToken", sellerToken);
      localStorage.setItem("sellerData", JSON.stringify(sellerData));
    }
  }, [sellerToken, sellerData]);

  // Handle loginå
  const handleLoginSuccess = (token, data) => {
    setSellerToken(token);
    setSellerData(data);
    localStorage.setItem("sellerToken", token);
    localStorage.setItem("sellerData", JSON.stringify(data));
  };

  // Handle logout
  const handleLogout = () => {
    setSellerToken(null);
    setSellerData(null);
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerData");
  };

  // Handle register success (go back to login page)
  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  if (!sellerToken) {
    return showRegister ? (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <Dashboard
      sellerToken={sellerToken}
      sellerData={sellerData}
      onLogout={handleLogout}
    />
  );
};

export default Seller;