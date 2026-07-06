
import { useState } from "react";
import "./Layout.css";
import { NavLink } from "react-router-dom";

function Layout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="layout">


      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <h2>MENU</h2>

        <nav className="sidebar-nav">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeSidebar}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeSidebar}
          >
            Productos
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeSidebar}
          >
            Categorías
          </NavLink>

          <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-link active nav-link-bottom" : "nav-link nav-link-bottom"
          }
          onClick={closeSidebar}
        >
          Perfil
        </NavLink>

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

  <h1 className="greeting">
    ¡Hola {user?.name || "Usuario"}!
  </h1>

</header>

        <div className="content">
          {children}
        </div>

      </main>
    </div>
  );
}

export default Layout;