import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./categorieslist.css";

const API_URL = import.meta.env.VITE_API_URL;

function CategoriesList() {

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


useEffect(() => {
     const getCategories = async () => { 
    try {
      const res = await fetch(`${API_URL}/categories`);

      if (!res.ok) {
        throw new Error("Error al obtener las categorías");
      }

      const data = await res.json();

      setCategories(data);


    } catch (err) {
      console.error("Error al obtener las categorías:", err);
    } finally {
      setLoading(false);
    }
  };

  getCategories();
}, []);

  const filteredCategories = categories.filter( (category) => 
    category.nombre.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="categories-page">

      {/* ENCABEZADO */}
      <div className="categories-header">
        <h1>Categorías</h1>

        <div className="actions">
          <input
            type="text"
            placeholder="🔍 Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={() => navigate("/categories/create")}>
            <span className="icon">＋</span>
            <span className="text">Agregar Categoría</span>
          </button>
        </div>
      </div>
  
      {/* LISTA DE CATEGORÍAS */}
      <div className="categories-list">
        {loading ? (
          <p>Cargando categorías...</p>
          
        ) : filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="category-name"
                onClick={() => navigate(`/categories/${category.id}`)}
              >
              
                <h3>{category.nombre}</h3>
              </div>
            ))        
        ) : (
          <p className="no-results">No se encontraron categorías.</p>
        )}
      </div>
    </div>

  );
}

export default CategoriesList;

//“Es un componente de React que
//  muestra las categorías. Al montarse 
// realiza una petición GET al endpoint
//  /categories mediante fetch. El backend 
// devuelve las categorías en formato JSON,
//  React las guarda en un estado mediante 
// setCategories y luego las muestra con map. Además permite
//  filtrarlas mediante un buscador y navegar hacia la creación 
// o el detalle de una categoría.”