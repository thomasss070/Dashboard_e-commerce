import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function Home() {
  const navigate = useNavigate();

  // Estados para guardar los totales
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Petición para obtener los productos
    const fetchProducts = fetch(`${API_URL}/products`).then((res) => res.json());

    // Petición para obtener las categorías
    const fetchCategories = fetch(`${API_URL}/categories`).then((res) => res.json());

    // Ejecutamos ambas peticiones en paralelo
    Promise.all([fetchProducts, fetchCategories])
      .then(([productsData, categoriesData]) => {
        if (Array.isArray(productsData)) {
          setProductsCount(productsData.length);
        }
        if (Array.isArray(categoriesData)) {
          setCategoriesCount(categoriesData.length);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar datos del Dashboard:', err);
        setLoading(false);
      });

    // Mensaje aleatorio de bienvenida
    const mensajes = [
      '¡Hola, te damos la bienvenida!',
      '¡Qué bueno verte de nuevo!',
      '¡Explora las novedades de hoy!',
      '¡Tu tienda lista para ti!',
      '¡Encuentra lo que buscas hoy!'
    ];
    setMensaje(mensajes[Math.floor(Math.random() * mensajes.length)]);
  }, []);

  return (
    <div className="home-container">
      <h1>Página de Inicio</h1>
      <p id="mensaje-bienvenida">{mensaje}</p>

      {/* CARD PRODUCTOS */}
      <div className="summary-card">
        <div className="left">
          <span className="icon">📦</span>
          <div>
            <h3>{loading ? 'Cargando...' : `${productsCount} Productos`}</h3>
          </div>
        </div>

        <div className="actions">
          <button
            className="btn secondary"
            onClick={() => navigate('/products')}
          >
            Ver listado
          </button>

          <button
            className="btn primary"
            onClick={() => navigate('/products/new')}
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
            <h3>{loading ? 'Cargando...' : `${categoriesCount} Categorías`}</h3>
          </div>
        </div>

        <div className="actions">
          <button
            className="btn secondary"
            onClick={() => navigate('/categories')}
          >
            Ver listado
          </button>

          <button
            className="btn primary"
            onClick={() => navigate('/categories/new')}
          >
            Agregar categoria
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;