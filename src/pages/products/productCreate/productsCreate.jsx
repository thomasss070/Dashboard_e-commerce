import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './productsCreate.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function ProductsCreate() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: 0,
    descripcion: '',
    categoria_id: '',
    imagen: '',
    especificaciones: '',
    flag: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar las categorías existentes para el select
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };

    fetchCategories();
  }, []);

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

    // Formateamos las especificaciones como un objeto plano JS (sin doble JSON.stringify)
    let specsToSave = null;
    if (formData.especificaciones && formData.especificaciones.trim() !== '') {
      const lineas = formData.especificaciones.split('\n');
      const specsObject = {};

      lineas.forEach((linea) => {
        const partes = linea.split(':');
        if (partes.length >= 2) {
          const clave = partes[0].trim();
          const valor = partes.slice(1).join(':').trim();
          if (clave) {
            specsObject[clave] = valor;
          }
        }
      });

      if (Object.keys(specsObject).length > 0) {
        specsToSave = specsObject;
      }
    }

    const productToSend = {
      nombre: formData.nombre,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      descripcion: formData.descripcion,
      categoria_id: formData.categoria_id ? Number(formData.categoria_id) : null,
      imagen: formData.imagen,
      especificaciones: specsToSave,
      flag: formData.flag,
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

      alert('¡Producto creado con éxito!');
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

      {error && <p>{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <div >
          
          <label>
            <strong>Nombre del producto:</strong>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: iPhone 14 Pro Max"
              required
            />
          </label>

          <label>
            <strong>Precio:</strong>
            <input
              type="number"
              name="precio"
              value={formData.precio}
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
            <select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Selecciona una categoría --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre || cat.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <strong>URL de la Imagen:</strong>
            <input
              type="text"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              placeholder="Ej: https://via.placeholder.com/150"
            />
          </label>

          <label>
            <strong>Descripción:</strong>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción del producto..."
              rows={4}
            />
          </label>

          <label>
            <strong>Especificaciones (clave: valor):</strong>
            <textarea
              name="especificaciones"
              value={formData.especificaciones}
              onChange={handleChange}
              placeholder={'pantalla: Super Retina XDR\nprocesador: Chip A19\ncamara: 48 MP'}
              rows={4}
            />
          </label>

          <div className="action-buttons" >
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