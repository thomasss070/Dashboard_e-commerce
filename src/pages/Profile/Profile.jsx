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
    password: "",
    role: "Cliente",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  //  Obtener lista de usuarios
  const loadUsers = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al consultar API");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  // Ver detalles de un usuario
  const handleViewDetails = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Error al obtener detalle");
      const data = await res.json();
      setSelectedUser(data);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
  };

  //  Registrar / Modificar
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error en la petición");

      resetForm();
      loadUsers();

      alert(
        editingId
          ? "Usuario actualizado correctamente."
          : "Usuario registrado correctamente."
      );
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("Ocurrió un error al procesar la solicitud.");
    }
  };

  // Cargar datos en el formulario para editar
  const handleEditClick = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Dejar en blanco si no se desea cambiar la clave
      role: user.role || "Cliente",
    });
  };

  // Resetear el formulario
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Cliente",
    });
  };

  // Eliminar un usuario
  
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }

      loadUsers();
      alert("Usuario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Ocurrió un error al eliminar el usuario.");
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">👤 Gestión de Usuarios</h1>

      <p className="profile-subtitle">
        Administración de usuarios registrados en la tienda.
      </p>

      {/* FORMULARIO DE REGISTRO / EDICIÓN */}
      <form className="profile-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder={
            editingId
              ? "Nueva clave (opcional)"
              : "Contraseña"
          }
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required={!editingId} // Obligatoria solo al crear
        />

        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
            onClick={resetForm}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* TABLA DE USUARIOS */}
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
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role || "Cliente"}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* DETALLES DEL USUARIO SELECCIONADO */}
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
            <strong>Rol:</strong> {selectedUser.role || "Cliente"}
          </p>
          {selectedUser.created_at && (
            <p>
              <strong>Registrado el:</strong> {selectedUser.created_at}
            </p>
          )}

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