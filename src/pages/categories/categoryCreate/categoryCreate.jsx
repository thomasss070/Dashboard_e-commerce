import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../categoryView/categoryview.css';
import './CategoryCreate.css'; // Estilos específicos del formulario

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function CategoryCreate() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Por favor, ingresa el nombre de la categoría.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name,
        nombre: formData.name,
        description: formData.description,
        descripcion: formData.description,
      };

      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Categoría creada con éxito');
        navigate('/categories');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Error: ${errData.error || 'No se pudo crear la categoría'}`);
      }
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      alert('Ocurrió un error de red al intentar crear la categoría');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="category-create-container">
      {/* ENCABEZADO */}
      <div className="pv-header category-header">
        <h2>Categorías &gt; Nueva Categoría</h2>
      </div>

      {/* INFORMACIÓN DE PREVISUALIZACIÓN */}
      <div className="product-info category-preview-info">
        <h1>{formData.name || 'Nueva Categoría'}</h1>
        <p>{formData.description || 'Ingresa los detalles a continuación'}</p>
      </div>

      {/* FORMULARIO DE CREACIÓN */}
      <form onSubmit={handleSave}>
        <div className="form category-form">
          <label className="form-field">
            <strong>Nombre de la Categoría:</strong>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre de la categoría"
              required
            />
          </label>

          <label className="form-field">
            <strong>Descripción:</strong>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción de la categoría..."
              rows={3}
            />
          </label>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="action-buttons category-action-buttons">
          <button 
            type="submit" 
            className="save-btn" 
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Crear Categoría'}
          </button>
          
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate('/categories')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryCreate;