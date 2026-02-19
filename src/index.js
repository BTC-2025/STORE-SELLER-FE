import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Global Fetch Interceptor for 401 Unauthorized
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    const url = typeof args[0] === 'string' ? args[0] : args[0].url;
    // Don't redirect if we're already on the login page or trying to login
    if (!url.includes('/api/seller/login') && !window.location.pathname.includes('/seller/login')) {
      console.warn('Unauthorized request! Redirecting to login...');
      localStorage.removeItem('sellerToken');
      localStorage.removeItem('sellerData');
      window.location.href = '/seller/login';
    }
  }
  return response;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
