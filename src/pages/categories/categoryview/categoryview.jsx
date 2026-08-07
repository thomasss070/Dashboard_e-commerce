import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './categoryview.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function CategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [products, setProducts] = useState([]);

  // 1. Obtener los datos de la categoría y los productos asociados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener la categoría
        const resCat = await fetch(`${API_URL}/categories/${id}`);
        if (!resCat.ok) throw new Error('Categoría no encontrada');
        const catData = await resCat.json();

        setFormData({
          name: catData.name || catData.nombre || '',
          description: catData.description || catData.descripcion || '',
        });

        // Obtener productos de esta categoría desde la API
        const resProds = await fetch(`${API_URL}/products?categoria_id=${id}`);
        if (resProds.ok) {
          const prodsData = await resProds.json();

          const rawList = Array.isArray(prodsData)
            ? prodsData
            : prodsData.productos || prodsData.data || [];

          setProducts(rawList);
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      const payload = {
        name: formData.name,
        nombre: formData.name,
        description: formData.description,
        descripcion: formData.description,
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
  const handleDeleteCategory = async () => {
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

  // 4. Quitar el producto de la categoría (pone categoria_id en null)
  // 4. Quitar el producto de la categoría (pone categoria_id en null)
const handleRemoveFromCategory = async (productId) => {
  if (!window.confirm('¿Deseas quitar este producto de me categoría?')) return;

  try {
    const prodToUpdate = products.find((p) => (p.id || p.id_product) === productId);
    
    // Si prodToUpdate no existe, mostramos el aviso para saberlo
    if (!prodToUpdate) {
      console.error('Producto no encontrado en el estado de React');
      return;
    }

    const payload = {
      ...prodToUpdate,
      categoria_id: null,
      category_id: null
    };

    console.log('Enviando payload al backend:', payload);

    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseData = await res.json().catch(() => ({}));
    console.log('Respuesta del Servidor (Status):', res.status, responseData);

    if (res.ok) {
      setProducts(products.filter((p) => (p.id || p.id_product) !== productId));
    } else {
      alert(`Error ${res.status}: ${responseData.error || 'No se pudo quitar el producto'}`);
    }
  } catch (error) {
    console.error('Error de red/petición:', error);
  }
};

  // 5. Eliminar el producto definitivamente de la base de datos
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar completamente este producto?')) return;

    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      } else {
        alert('No se pudo eliminar el producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  if (loading) {
    return <h2 style={{ padding: '20px' }}>Cargando categoría...</h2>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* ENCABEZADO */}
      <div className="pv-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Categorías &gt; #{id}</h2>

        <button className="delete-btn" onClick={handleDeleteCategory}>
          Eliminar Categoría
        </button>
      </div>

      {/* INFORMACIÓN DE LA CATEGORÍA */}
      <div className="product-info" style={{ marginBottom: '20px' }}>
        <h1>{formData.name || 'Sin Nombre'}</h1>
        <p style={{ color: '#666', marginTop: '5px' }}>
          {formData.description || 'Sin descripción'}
        </p>
      </div>

      {/* FORMULARIO DE EDICIÓN */}
      <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <strong>Nombre de la Categoría:</strong>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre de la categoría"
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

      {/* BOTONES DE ACCIÓN DE LA CATEGORÍA */}
      <div className="action-buttons" style={{ marginTop: '20px', marginBottom: '40px' }}>
        <button className="save-btn" onClick={handleSave}>
          Guardar Cambios
        </button>
        <button className="cancel-btn" onClick={() => navigate('/categories')}>
          Cancelar
        </button>
      </div>

      <hr style={{ margin: '30px 0' }} />

      {/* SECCIÓN DE PRODUCTOS ASOCIADOS */}
      <div className="category-products-section">
        <h3>Productos en esta categoría ({products.length})</h3>

        {products.length === 0 ? (
          <p style={{ color: '#777', marginTop: '10px' }}>No hay productos asociados a esta categoría.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
            {products.map((prod) => (
              <li
                key={prod.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  backgroundColor: '#fff',
                }}
              >
                <div>
                  <strong>{prod.nombre || prod.name}</strong>
                  {prod.precio && <span style={{ color: '#555', marginLeft: '10px' }}>${prod.precio}</span>}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    to={`/products/${prod.id}`}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    Ver / Editar
                  </Link>

                  <button
                    onClick={() => handleRemoveFromCategory(prod.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Quitar de categoría
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CategoryView;