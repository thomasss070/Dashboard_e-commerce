import { useState } from "react";
import "./Layout.css";
import { Link } from "react-router-dom";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <h2>MENU</h2>

        <nav className="sidebar-nav">
          <Link to="/">Home</Link>

          <Link to="/products">
            Productos
          </Link>

          <Link to="/products/new">
            Nuevo producto
          </Link>

          <Link to="/profile">
            Perfil
          </Link>
        </nav>

      </aside>

      {/* Main Area */}
      <main className="main-area">
        <header className="topbar">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </header>

        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
