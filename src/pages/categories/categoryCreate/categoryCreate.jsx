import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../categoryView/categoryview.css';

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

  // Función para crear la categoría (POST)
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* ENCABEZADO */}
      <div className="pv-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Categorías &gt; Nueva Categoría</h2>
      </div>

      {/* INFORMACIÓN DE PREVISUALIZACIÓN */}
      <div className="product-info" style={{ marginBottom: '20px' }}>
        <h1>{formData.name || 'Nueva Categoría'}</h1>
        <p style={{ color: '#666', marginTop: '5px' }}>
          {formData.description || 'Ingresa los detalles a continuación'}
        </p>
      </div>

      {/* FORMULARIO DE CREACIÓN */}
      <form onSubmit={handleSave}>
        <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
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

          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
        <div className="action-buttons" style={{ marginTop: '20px', marginBottom: '40px' }}>
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