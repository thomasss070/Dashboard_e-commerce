import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './productslist.css';

function ProductsList() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const fakeProducts = [
      { id: 1, name: "Remera Nike" },
      { id: 2, name: "Zapatillas Adidas" },
      { id: 3, name: "Campera North Face" }
    ];

    setProducts(fakeProducts);

  }, []);

  // 🔥 FILTRO BIEN HECHO (AQUÍ VA)
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
    
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

        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <h3>{product.name}</h3>
          </div>
        ))}

      </div>

    </div>
  );
}

export default ProductsList;