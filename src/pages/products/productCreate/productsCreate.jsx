import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './productsCreate.css'; // O el archivo CSS que uses para los formularios

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function ProductsCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: 0,
    descripcion: '',
    categoria: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mapeamos los datos asegurando los tipos correctos
    const productToSend = {
      nombre: formData.name,
      precio: Number(formData.price),
      stock: Number(formData.stock),
      descripcion: formData.description,
      categoria: formData.category,
    };

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSend),
      });

      if (!res.ok) {
        throw new Error('No se pudo crear el producto');
      }

      const data = await res.json();
      alert('¡Producto creado con éxito!');
      
      // Redireccionamos al listado de productos
      navigate('/products');
    } catch (err) {
      console.error('Error al crear el producto:', err);
      setError('Hubo un error al guardar el producto. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Nuevo Producto</h1>
        <button className="cancel-btn" onClick={() => navigate('/products')}>
          Volver
        </button>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
          
          <label>
            <strong>Nombre del producto:</strong>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Iphone 14 Pro Max"
              required
            />
          </label>

          <label>
            <strong>Precio:</strong>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ej: 15000"
              required
            />
          </label>

          <label>
            <strong>Stock:</strong>
            <div className="stock">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    stock: Math.max(0, Number(formData.stock) - 1),
                  })
                }
              >
                -
              </button>
              <span>{formData.stock}</span>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    stock: Number(formData.stock) + 1,
                  })
                }
              >
                +
              </button>
            </div>
          </label>

          <label>
            <strong>Categoría:</strong>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Ej: Iphone"
            />
          </label>

          <label>
            <strong>Descripción:</strong>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del producto..."
              rows={4}
            />
          </label>

          <div className="action-buttons" style={{ marginTop: '20px' }}>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Producto'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/products')}
            >
              Cancelar
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

export default ProductsCreate;