import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importación de Páginas (rutas apuntando a `src`)
import Home from './src/pages/home/home';
import ProductsList from './src/pages/products/productslist/productslist';
import ProductView from './src/pages/products/productsviews/productviews';
import ProductCreate from './src/pages/products/productCreate/productsCreate'; // La creamos en el Paso 2
import Profile from './src/pages/Profile/Profile';                         // La creamos en el Paso 2
import NotFound from './src/pages/notFound/notFound';                     // La creamos en el Paso 2
import CategoriesList from './src/pages/categories/categorieslist/categorieslist';
import CategoryView from './src/pages/categories/categoryview/categoryview';
import './src/App.css';

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


          {/* 📁 Gestión de Categorías */}
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/:id" element={<CategoryView />} />

          {/* ⚠️ Ruta por defecto (Error 404) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;