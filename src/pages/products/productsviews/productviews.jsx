import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './productviews.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = id && !Number.isNaN(Number(id)) ? Number(id) : null;

  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);

  // 1. Estado unificado
  const [formData, setFormData] = useState({
    nombre: '',
    precio: 0,
    stock: 0,
    descripcion: '',
    imagen: '',
    especificaciones: '',
    categoria_id: '',
    flag: ''
  });

  // 2. Cargar lista de categorías disponibles
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener categorías');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategorias(data);
        } else {
          setCategorias([]);
        }
      })
      .catch((err) => {
        console.error('Error cargando categorías:', err);
        setCategorias([]);
      });
  }, []);

  // 3. Cargar los datos del producto
  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Producto no encontrado');
        return res.json();
      })
      .then((data) => {
        let specsText = '';

        if (typeof data.especificaciones === 'object' && data.especificaciones !== null) {
          specsText = Object.entries(data.especificaciones)
            .map(([key, val]) => `${key}: ${val}`)
            .join('\n');
        } else if (typeof data.especificaciones === 'string' && data.especificaciones.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(data.especificaciones);
            specsText = Object.entries(parsed)
              .map(([key, val]) => `${key}: ${val}`)
              .join('\n');
          } catch (e) {
            specsText = data.especificaciones;
          }
        } else {
          specsText = data.especificaciones || '';
        }

        // Extraer ID de categoría limpiando decimales como "999.0"
        const rawCat = data.categoria_id ?? data.category_id ?? data.categoria;
        const cleanCatId = rawCat !== undefined && rawCat !== null && rawCat !== '' ? parseInt(rawCat, 10) : '';

        setFormData({
          nombre: data.nombre || data.name || '',
          precio: data.precio || data.price || 0,
          stock: data.stock || 0,
          descripcion: data.descripcion || data.description || '',
          imagen: data.imagen || '',
          especificaciones: specsText,
          categoria_id: cleanCatId !== '' && !isNaN(cleanCatId) ? String(cleanCatId) : '',
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4. Guardar cambios (PUT)
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

      // Parsear ID de categoría garantizando que sea entero
      const parsedCatId = formData.categoria_id !== '' ? parseInt(formData.categoria_id, 10) : null;
      const validCatId = parsedCatId !== null && !isNaN(parsedCatId) ? parsedCatId : null;

      const payloadToSend = {
        id: productId,
        product_id: productId,
        nombre: formData.nombre.trim(),
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        descripcion: formData.descripcion,
        imagen: formData.imagen,
        especificaciones: specsToSave,
        categoria_id: validCatId,
        category_id: validCatId,
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
        const errorData = await res.json().catch(() => ({}));
        console.error('Detalle del error del backend:', errorData);
        alert(`Error al actualizar (${res.status}): ${errorData.error || 'Revisá la consola del servidor'}`);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // 5. Eliminar producto (DELETE)
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
      // Leemos el mensaje enviado por la API
      const errorData = await res.json().catch(() => ({}));
      console.log('Status code:', res.status);
      console.log('Respuesta del servidor:', errorData);
      alert(`Error ${res.status}: ${errorData.error || errorData.message || 'Error al eliminar'}`);
    }
  } catch (error) {
    console.error('Error de red o conexión:', error);
  }
};
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
        <p>Precio: ${Number(formData.precio || 0).toLocaleString()}</p>
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

        <label>Categoría:</label>
        <select
          name="categoria_id"
          value={formData.categoria_id}
          onChange={handleChange}
        >
          <option value="">-- Seleccionar Categoría --</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

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