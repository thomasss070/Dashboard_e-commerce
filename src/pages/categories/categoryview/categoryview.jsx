import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './categoryview.css'; // O productviews.css si usas las mismas clases

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function CategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
  });

  // 1. Obtener los datos de la categoría desde la base de datos al cargar
  useEffect(() => {
    fetch(`${API_URL}/categories/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Categoría no encontrada');
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name || data.nombre || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar la categoría:', err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 2. Función para actualizar la categoría (PUT)
  const handleSave = async () => {
    try {
      // Mapeamos por si tu backend espera "nombre" en lugar de "name"
      const payload = {
        name: formData.name,
        nombre: formData.name,
      };

      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Categoría actualizada con éxito');
        navigate('/categories');
      } else {
        alert('Error al actualizar la categoría');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // 3. Función para eliminar la categoría (DELETE)
  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Categoría eliminada');
        navigate('/categories');
      } else {
        alert('Error al eliminar la categoría');
      }
    } catch (error) {
      console.error('Error al borrar:', error);
    }
  };

  if (loading) {
    return <h2 style={{ padding: '20px' }}>Cargando categoría...</h2>;
  }

  return (
    <div>
      {/* ENCABEZADO */}
      <div className="pv-header">
        <h2>Categorías &gt; #{id}</h2>

        <button className="delete-btn" onClick={handleDelete}>
          Eliminar
        </button>
      </div>

      {/* INFORMACIÓN DE LA CATEGORÍA */}
      <div className="product-info">
        <h1>{formData.name || 'Sin Nombre'}</h1>
      </div>

      {/* FORMULARIO DE EDICIÓN */}
<div className="form">
  <label>Nombre de la Categoría:</label>
  <input
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Nombre de la categoría"
  />
</div>

      {/* BOTONES DE ACCIÓN */}
      <div className="action-buttons" style={{ marginTop: '20px' }}>
        <button className="save-btn" onClick={handleSave}>
          Guardar
        </button>
        <button className="cancel-btn" onClick={() => navigate('/categories')}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default CategoryView;