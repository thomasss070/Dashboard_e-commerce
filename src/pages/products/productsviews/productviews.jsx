import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './productviews.css';

function ProductView() {

  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>

      {/* HEADER */}
      <div className="pv-header">

        <h2>Productos &gt; #{id}</h2>

        <button
          className="delete-btn"
          onClick={() => navigate("/products")}
        >
          Eliminar
        </button>

      </div>

      {/* INFO PRODUCTO */}
      <div className="product-info">
        <h1>Nombre del producto</h1>
        <p>Precio: $19.900</p>
        <p>Stock: 999</p>
      </div>

      {/* FORM */}
      <div className="form">

        <input placeholder="Nombre" />
        <input placeholder="Valor" />

        <div className="stock">
          <button>-</button>
          <span>1</span>
          <button>+</button>
        </div>

        <textarea placeholder="Descripción" />

        <select>
          <option>Tienda</option>
        </select>

      </div>

      {/* GALERÍA */}
      <div className="gallery">
        <input placeholder="Nueva imagen" />
      </div>

    </div>
  );
}

export default ProductView;