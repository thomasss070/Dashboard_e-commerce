import React from 'react';
import './categorieslist.css';

function CategoriesList() {
    const categories = [
    { id: 1, name: "Ropa" },
    { id: 2, name: "Accesorios" },
    { id: 3, name: "Calzado" }
  ];

  return (
    <div>
      <h1>📁 Lista de Categorías</h1>
    </div>
  );
}

export default CategoriesList;

