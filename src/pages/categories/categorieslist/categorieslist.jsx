import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./categorieslist.css";


// Lee la URL definida en tu archivo .env (ejemplo: http://localhost:3001/api)
const API_URL = import.meta.env.VITE_API_URL;

function CategoriesList() {

  const navigate = useNavigate();

  // El estado inicia vacío (se llenará desde la base de datos)
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Obtiene las categorías reales cuando el componente se monta
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener las categorías");
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener las categorías:", err);
        setLoading(false);
      });
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
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

          <button onClick={() => navigate("/categories/new")}>
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

