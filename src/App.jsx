import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home/home.jsx';
import ProductsList from './pages/products/productslist/productslist.jsx';
import ProductView from './pages/products/productsviews/productviews.jsx';
import ProductsCreate from './pages/products/productCreate/productsCreate.jsx';
import Profile from './pages/Profile/Profile.jsx';
import NotFound from './pages/notFound/notFound.jsx';
import Layout from "./componets/Layout/Layout";
import CategoriesList from './pages/categories/categorieslist/categorieslist.jsx';
import CategoryView from './pages/categories/categoryview/categoryview.jsx';
import './App.css';



function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/new" element={<ProductsCreate />} />
          <Route path="/products/:id" element={<ProductView />} />   
          <Route path="/profile" element={<Profile />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/:id" element={<CategoryView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;



