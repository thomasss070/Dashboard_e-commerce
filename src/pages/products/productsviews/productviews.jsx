import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './productviews.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
  });

  // 1. Obtener los datos del producto desde la base de datos al cargar
  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Producto no encontrado');
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name || data.nombre || '',
          price: data.price || data.precio || 0,
          stock: data.stock || 0,
          description: data.description || data.descripcion || '',
          store: data.store || 'Tienda A',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar el producto:', err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 2. Función para actualizar el producto (PUT)
  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Producto actualizado con éxito');
        navigate('/products');
      } else {
        alert('Error al actualizar el producto');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // 3. Función para eliminar el producto (DELETE)
  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Producto eliminado');
        navigate('/products');
      } else {
        alert('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error al borrar:', error);
    }
  };

  if (loading) {
    return <h2 style={{ padding: '20px' }}>Cargando producto...</h2>;
  }

  return (
    <div>
      {/* ENCABEZADO */}
      <div className="pv-header">
        <h2>Productos &gt; #{id}</h2>

        <button className="delete-btn" onClick={handleDelete}>
          Eliminar
        </button>
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="product-info">
        <h1>{formData.name}</h1>
        <p>Precio: ${Number(formData.price).toLocaleString()}</p>
        <p>Stock: {formData.stock}</p>
      </div>

      {/* FORMULARIO DE EDICIÓN */}
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
        <input placeholder="Nueva imagen (URL)" />
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="action-buttons">
        <button className="save-btn" onClick={handleSave}>
          Guardar
        </button>
        <button className="cancel-btn" onClick={() => navigate('/products')}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default ProductView;