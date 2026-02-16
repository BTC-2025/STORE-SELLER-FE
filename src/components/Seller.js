import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";

const Seller = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Load from localStorage on first render
  const [sellerToken, setSellerToken] = useState(localStorage.getItem("sellerToken"));
  const [sellerData, setSellerData] = useState(
    JSON.parse(localStorage.getItem("sellerData")) || null
  );

  // Persist state changes into localStorage
  useEffect(() => {
    if (sellerToken && sellerData) {
      localStorage.setItem("sellerToken", sellerToken);
      localStorage.setItem("sellerData", JSON.stringify(sellerData));
    } else if (!sellerToken) {
      localStorage.removeItem("sellerToken");
      localStorage.removeItem("sellerData");
    }
  }, [sellerToken, sellerData]);

  // Handle logout
  const handleLogout = () => {
    setSellerToken(null);
    setSellerData(null);
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerData");
    navigate("/seller/login");
  };

  // Auth Guard: If no token, redirect to login
  if (!sellerToken) {
    return <Navigate to="/seller/login" state={{ from: location }} replace />;
  }

  return (
    <Outlet context={{ sellerToken, sellerData, handleLogout }} />
  );
};

export default Seller;