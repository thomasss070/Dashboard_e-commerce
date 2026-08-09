import React, { useState, useEffect } from "react";
import "./Profile.css";

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Cliente",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // ==========================
  // Obtener usuarios
  // ==========================
  const loadUsers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  // ==========================
  // Ver detalles
  // ==========================
  const handleViewDetails = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();
      setSelectedUser(data);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
  };

  // ==========================
  // Crear / Editar
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setFormData({
        name: "",
        email: "",
        role: "Cliente",
      });

      setEditingId(null);
      loadUsers();

      alert(
        editingId
          ? "Usuario actualizado correctamente."
          : "Usuario registrado correctamente."
      );
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  // ==========================
  // Cargar datos para editar
  // ==========================
  const handleEditClick = (user) => {
    setEditingId(user.id);

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role || "Cliente",
    });
  };

  // ==========================
  // Eliminar
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }

      loadUsers();

      alert("Usuario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">👤 Gestión de Usuarios</h1>

      <p className="profile-subtitle">
        Administración de usuarios registrados en la tienda.
      </p>

      <form className="profile-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del usuario"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
          required
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
          required
        />

        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value,
            })
          }
        >
          <option value="Administrador">Administrador</option>
          <option value="Cliente">Cliente</option>
        </select>

        <button className="btn btn-primary" type="submit">
          {editingId ? "Guardar cambios" : "Registrar Usuario"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setEditingId(null);

              setFormData({
                name: "",
                email: "",
                role: "Cliente",
              });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="profile-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.role}</td>

              <td>
                <div className="actions">
                  <button
                    className="btn btn-view"
                    onClick={() => handleViewDetails(user.id)}
                  >
                    👁️ Ver
                  </button>

                  <button
                    className="btn btn-edit"
                    onClick={() => handleEditClick(user)}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="user-details">
          <h3>Detalles del Usuario</h3>

          <p>
            <strong>ID:</strong> {selectedUser.id}
          </p>

          <p>
            <strong>Nombre:</strong> {selectedUser.name}
          </p>

          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>

          <p>
            <strong>Rol:</strong> {selectedUser.role}
          </p>

          <button
            className="btn btn-secondary"
            onClick={() => setSelectedUser(null)}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}