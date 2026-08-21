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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const resCat = await fetch(`${API_URL}/categories/${id}`);
        if (!resCat.ok) throw new Error('Categoría no encontrada');
        const catData = await resCat.json();

        setFormData({
          name: catData.name || catData.nombre || '',
          description: catData.description || catData.descripcion || '',
        });

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

  const handleRemoveFromCategory = async (productId) => {
    if (!window.confirm('¿Deseas quitar este producto de la categoría?')) return;

    try {
      const prodToUpdate = products.find((p) => (p.id || p.id_product) === productId);

      if (!prodToUpdate) {
        console.error('Producto no encontrado en el estado de React');
        return;
      }

      const payload = {
        ...prodToUpdate,
        categoria_id: null,
        category_id: null
      };

      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => ({}));

      if (res.ok) {
        setProducts(products.filter((p) => (p.id || p.id_product) !== productId));
      } else {
        alert(`Error ${res.status}: ${responseData.error || 'No se pudo quitar el producto'}`);
      }
    } catch (error) {
      console.error('Error de red/petición:', error);
    }
  };

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
    return <h2 className="cv-container">Cargando categoría...</h2>;
  }

  return (
    <div className="cv-container">
      {/* ENCABEZADO */}
      <div className="pv-header cv-header">
        <h2>Categorías &gt; #{id}</h2>

        <button className="delete-btn" onClick={handleDeleteCategory}>
          Eliminar Categoría
        </button>
      </div>

      {/* INFORMACIÓN DE LA CATEGORÍA */}
      <div className="product-info cv-category-info">
        <h1>{formData.name || 'Sin Nombre'}</h1>
        <p>{formData.description || 'Sin descripción'}</p>
      </div>

      {/* FORMULARIO DE EDICIÓN */}
      <div className="form cv-form">
        <label className="cv-form-field">
          <strong>Nombre de la Categoría:</strong>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre de la categoría"
          />
        </label>

        <label className="cv-form-field">
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
      <div className="action-buttons cv-action-buttons">
        <button className="save-btn" onClick={handleSave}>
          Guardar Cambios
        </button>
        <button className="cancel-btn" onClick={() => navigate('/categories')}>
          Cancelar
        </button>
      </div>

      <hr className="cv-divider" />

      {/* SECCIÓN DE PRODUCTOS ASOCIADOS */}
      <div className="category-products-section">
        <h3>Productos en esta categoría ({products.length})</h3>

        {products.length === 0 ? (
          <p className="cv-empty-text">No hay productos asociados a esta categoría.</p>
        ) : (
          <ul className="cv-products-list">
            {products.map((prod) => {
              const productId = prod.id || prod.id_product;
              return (
                <li key={productId} className="cv-product-item">
                  <div>
                    <strong>{prod.nombre || prod.name}</strong>
                    {prod.precio && <span className="cv-product-price">${prod.precio}</span>}
                  </div>

                  <div className="cv-product-actions">
                    <Link to={`/products/${productId}`} className="cv-btn-edit">
                      Ver / Editar
                    </Link>

                    <button
                      onClick={() => handleRemoveFromCategory(productId)}
                      className="cv-btn-remove"
                    >
                      Quitar de categoría
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(productId)}
                      className="cv-btn-delete"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CategoryView;