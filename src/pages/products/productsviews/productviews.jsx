import React from 'react';
import { useParams } from 'react-router-dom';
import './productviews.css';

function ProductView() {
  const { id } = useParams();

  return (
    <div>
      <h1>🔍 Detalle del Producto</h1>
      <p>Viendo el producto con ID de ruta: <strong>{id}</strong></p>
    </div>
  );
}

export default ProductView;