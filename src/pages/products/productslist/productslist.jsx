import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./productslist.css";
import { products as initialProducts } from "../../../data/productsprueba.js";

function ProductsList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">

      {/* HEADER */}
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

      {/* LISTA */}
      <div className="products-list">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <h3>{product.name}</h3>
          </div>
        ))
      ) : (
        search.trim() !== "" && (
          <p className="no-results">No se encontraron productos.</p>
        )
      )}
      </div>

    </div>
  );
}

export default ProductsList;