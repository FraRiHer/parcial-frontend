// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    password: '',
  });

  // Estado para almacenar los usuarios registrados
  const [users, setUsers] = useState([]);

  // Estado para manejar cuál pantalla mostrar
  const [showRegister, setShowRegister] = useState(true); // true muestra el formulario, false muestra la lista de usuarios

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí deberías realizar la lógica de envío al backend
    setUsers([...users, formData]);

    // Limpiar el formulario después del registro
    setFormData({
      firstName: '',
      lastName: '',
      birthDate: '',
      password: '',
    });

    // Cambiar a la pantalla de lista de usuarios después de registrar
    setShowRegister(false);
  };

  return (
    <div className="App">
      <h1>Aplicación de Registro de Usuarios</h1>
      <div>
        <button onClick={() => setShowRegister(true)}>Registrar Usuario</button>
        <button onClick={() => setShowRegister(false)}>Ver Usuarios Registrados</button>
      </div>

      {showRegister ? (
        <div>
          <h2>Registro de Usuarios</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Nombres:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Apellidos:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Fecha de nacimiento:</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Registrar</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Usuarios Registrados</h2>
          {users.length === 0 ? (
            <p>No hay usuarios registrados aún.</p>
          ) : (
            <ul>
              {users.map((user, index) => (
                <li key={index}>
                  {user.firstName} {user.lastName}, Nacimiento: {user.birthDate}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
