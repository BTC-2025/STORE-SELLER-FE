import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Seller from './components/Seller';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ProductsList from './components/Dashboard/ProductList/ProductsList';
import AddProductPage from './components/Dashboard/Addproduct/AddProductPage';
import OrdersList from './components/Dashboard/Orderlist/OrdersList';
import CreateBrandPage from './components/Dashboard/CreateBrand/CreateBrandPage';
import ComplaintsManagement from './components/Dashboard/Complaints/ComplaintsManagement';
import ReturnOrder from './components/Dashboard/Return/ReturnOrder';
import SellerProfile from './components/Profile/SellerProfile';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/seller/login" element={<Login />} />
        <Route path="/seller/register" element={<Register />} />

        {/* Protected Seller Routes */}
        <Route path="/seller" element={<Seller />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="add-product" element={<AddProductPage />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="create-brand" element={<CreateBrandPage />} />
          <Route path="complaints" element={<ComplaintsManagement />} />
          <Route path="returns" element={<ReturnOrder />} />
          <Route path="profile" element={<SellerProfile />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/seller" replace />} />
        <Route path="*" element={<Navigate to="/seller" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
