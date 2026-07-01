import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home/home.jsx';
import ProductsList from './pages/products/productslist/productslist.jsx';
import ProductView from './pages/products/productsviews/productviews.jsx';
import ProductCreate from './pages/products/productCreate/prodcutsCreate.jsx';
import Profile from './pages/Profile/Profile.jsx';
import NotFound from './pages/notFound/notFound.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/new" element={<ProductCreate />} />
          <Route path="/products/:id" element={<ProductView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
