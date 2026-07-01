import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importación de Páginas
import Home from './pages/home/home';
import ProductsList from './pages/products/productsList/productslist';
import ProductView from './pages/products/productview/productview';
import ProductCreate from './pages/products/productCreate/productsCreate'; // La creamos en el Paso 2
import Profile from './pages/Profile/Profile';                         // La creamos en el Paso 2
import NotFound from './pages/notFound/notFound';                     // La creamos en el Paso 2
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ padding: '20px' }}>
        <Routes>
          {/* 🏠 Página de Inicio */}
          <Route path="/" element={<Home />} />

          {/* 📦 Gestión de Productos */}
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/new" element={<ProductCreate />} />
          <Route path="/products/:id" element={<ProductView />} />

          {/* 👤 Perfil del Usuario */}
          <Route path="/profile" element={<Profile />} />

          {/* ⚠️ Ruta por defecto (Error 404) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;