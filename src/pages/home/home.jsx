import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

function Home() {

  const navigate = useNavigate();

  const [products] = useState([
    { id: 1 },
    { id: 2 },
    { id: 3 }
  ]);

  const [categories] = useState([
    { id: 1 },
    { id: 2 }
  ]);

  return (
    <div>

      <h1>🏠 Página de Inicio</h1>
      <p>Bienvenido al Dashboard del Ecommerce.</p>

      {/* CARD PRODUCTOS */}
      <div className="summary-card">

        <div className="left">
          <span className="icon">📦</span>

          <div>
   <h3>{products.length} Productos</h3>
          </div>
        </div>

        <div className="actions">
          <button
            className="btn secondary"
            onClick={() => navigate("/products")}
          >
            Ver listado
          </button>

          <button
            className="btn primary"
            onClick={() => navigate("/products/new")}
          >
            Agregar producto
          </button>
        </div>

      </div>

      {/* CARD CATEGORÍAS */}
      <div className="summary-card">

        <div className="left">
          <span className="icon">📁</span>

          <div>
            <h3> {categories.length} Categorías</h3>
          </div>
        </div>
         <div className="actions">
          <button
            className="btn secondary"
            onClick={() => navigate("/categories")}
          >
            Ver listado
          </button>

          <button
            className="btn primary"
            onClick={() => navigate("/categories/new")}
          >
            Agregar categoria
          </button>
        </div>

      </div>

    </div>
  );
}

export default Home;