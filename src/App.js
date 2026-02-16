import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Seller from './components/Seller';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Seller />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
