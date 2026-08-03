import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './productviews.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // 1. Estado unificado
  const [formData, setFormData] = useState({
    nombre: '',
    precio: 0,
    stock: 0,
    descripcion: '',
    imagen: '',
    especificaciones: '',
    categoria: '',
    flag: ''
  });

  // 2. Cargar los datos del producto
  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Producto no encontrado');
        return res.json();
      })
      .then((data) => {
        let specsText = '';

        // CASO A: Viene como un Objeto JavaScript (gracias al parseo del Backend)
        if (typeof data.especificaciones === 'object' && data.especificaciones !== null) {
          specsText = Object.entries(data.especificaciones)
            .map(([key, val]) => `${key}: ${val}`)
            .join('\n');
        } 
        // CASO B: Viene como un String JSON plano (ej: '{"pantalla":"Retina"}')
        else if (typeof data.especificaciones === 'string' && data.especificaciones.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(data.especificaciones);
            specsText = Object.entries(parsed)
              .map(([key, val]) => `${key}: ${val}`)
              .join('\n');
          } catch (e) {
            specsText = data.especificaciones;
          }
        } 
        // CASO C: Texto plano o vacío
        else {
          specsText = data.especificaciones || '';
        }

        setFormData({
          nombre: data.nombre || data.name || '',
          precio: data.precio || data.price || 0,
          stock: data.stock || 0,
          descripcion: data.descripcion || data.description || '',
          imagen: data.imagen || '',
          especificaciones: specsText,
          categoria: data.categoria || '',
          flag: data.flag || ''
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

  // 3. Guardar cambios (PUT)
  const handleSave = async () => {
    try {
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
          specsToSave = JSON.stringify(specsObject);
        } else {
          specsToSave = formData.especificaciones.trim();
        }
      }

      const payloadToSend = {
        nombre: formData.nombre,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        descripcion: formData.descripcion,
        imagen: formData.imagen,
        especificaciones: specsToSave,
        categoria: formData.categoria,
        flag: formData.flag
      };

      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadToSend),
      });

      if (res.ok) {
        alert('¡Producto actualizado con éxito!');
        navigate('/products');
      } else {
        alert('Error al actualizar el producto');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // 4. Eliminar producto (DELETE)
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
        <h1>{formData.nombre}</h1>
        <p>Precio: ${Number(formData.precio).toLocaleString()}</p>
        <p>Stock: {formData.stock}</p>
      </div>

      {/* FORMULARIO DE EDICIÓN */}
      <div className="form">
        <label>Nombre:</label>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre del producto"
        />

        <label>Precio:</label>
        <input
          name="precio"
          type="number"
          value={formData.precio}
          onChange={handleChange}
          placeholder="Precio"
        />

        <label>Stock:</label>
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

        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          rows={3}
        />

        <label>Especificaciones:</label>
        <textarea
          name="especificaciones"
          value={formData.especificaciones}
          onChange={handleChange}
          placeholder="pantalla: Super Retina XDR&#10;procesador: Chip A19"
          rows={4}
        />
      </div>

      {/* GALERÍA / IMAGEN */}
      <div className="gallery">
        <label>URL de Imagen:</label>
        <input
          name="imagen"
          value={formData.imagen}
          onChange={handleChange}
          placeholder="URL de la imagen"
        />
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