import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./productslist.css";


// Lee la URL definida en tu archivo .env (ejemplo: http://localhost:3001/api)
const API_URL = import.meta.env.VITE_API_URL;

function ProductsList() {
  const navigate = useNavigate();

  // El estado inicia vacío (se llenará desde la base de datos)
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Obtiene los productos reales cuando el componente se monta
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      
      if (!res.ok) {
        throw new Error("Error al obtener los productos");
      }
      
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error al obtener los productos:", err);
    } finally {
      setLoading(false); // Se ejecuta siempre, haya error o no
    }
  };

  fetchProducts();
}, []);

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(search.toLowerCase()) || 
    (product.categoria && product.categoria.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="products-page">

      {/* ENCABEZADO */}
      <div className="products-header">

        <h1>Productos</h1>

        <div className="actions">

          <input
            type="text"
            placeholder="🔍 Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={() => navigate("/products/new")}>
            <span className="icon">＋</span>
            <span className="text">Agregar Producto</span>
          </button>

        </div>

      </div>

      {/* LISTADO */}
      <div className="products-list">
        {loading ? (
          <p className="no-results">Cargando productos...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id || product._id}
              className="product-card"
              onClick={() => navigate(`/products/${product.id || product._id}`)}
            >
              <h3>{product.nombre}</h3>
            </div>
          ))
        ) : (
          <p className="no-results">No se encontraron productos.</p>
        )}
      </div>

    </div>
  );
}

export default ProductsList;