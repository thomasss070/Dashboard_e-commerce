import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './productviews.css';
import { products } from '../../../data/productsprueba.js';

function ProductView() {

  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === Number(id));

  const [formData, setFormData] = useState({
  name: product.name,
  price: product.price,
  stock: product.stock,
  description: product.description,
  store: product.store,
  });

  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
    });
  };

  if (!product) {
    return <h2>Producto no encontrado.</h2>;
  }
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
        <h1>{product.name}</h1>
        <p>Precio: ${product.price.toLocaleString()}</p>
        <p>Stock: {product.stock}</p>
      </div>

      {/* FORM */}
      <div className="form">

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nombre"
        />

        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Valor"
        />

        <div className="stock">
          <button
            onClick={() =>
              setFormData({
                ...formData,
                stock: Math.max(0, formData.stock - 1),
              })
            }
          >
            -
          </button>

          <span>{formData.stock}</span>

          <button
            onClick={() =>
              setFormData({
                ...formData,
                stock: formData.stock + 1,
              })
            }
            >
            +
          </button>
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción"
        />

        <select
          name="store"
          value={formData.store}
          onChange={handleChange}
        >
          <option value="Tienda A">Tienda A</option>
          <option value="Tienda B">Tienda B</option>
        </select>

      </div>

      {/* GALERÍA */}
      <div className="gallery">
        <input placeholder="Nueva imagen" />
      </div>

       {/* BOTONES DE ACCIÓN */}
    <div className="action-buttons">
    <button className="save-btn">Guardar</button>
    <button className="cancel-btn" onClick={() => navigate("/products")}>
      Cancelar
    </button>
    </div>

    </div>
    
  );
   

  
}

export default ProductView;