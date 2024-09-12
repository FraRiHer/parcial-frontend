import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

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

    // Enviar datos al backend Flask usando axios
    axios.post('http://ec2-52-2-70-59.compute-1.amazonaws.com:5000/register', formData)
      .then(response => {
        console.log('Usuario registrado:', response.data);

        // Agregar el usuario registrado a la lista de usuarios
        setUsers([...users, formData]);

        // Cambiar a la pantalla de lista de usuarios después de registrar
        setShowRegister(false);
      })
      .catch(error => {
        console.error('Error al registrar el usuario:', error);
      });

    // Limpiar el formulario después del registro
    setFormData({
      firstName: '',
      lastName: '',
      birthDate: '',
      password: '',
    });
  };

  // Función para obtener los usuarios registrados desde el backend
  const fetchUsers = () => {
    axios.get('http://ec2-52-2-70-59.compute-1.amazonaws.com:5000/users')
      .then(response => {
        setUsers(response.data);
        setShowRegister(false);
      })
      .catch(error => {
        console.error('Error al obtener usuarios:', error);
      });
  };

  return (
    <div className="App">
      <h1>Aplicación de Registro de nuevo Usuarios</h1>
      <div>
        <button onClick={() => setShowRegister(true)}>Registrar Usuario</button>
        <button onClick={fetchUsers}>Ver Usuarios Registrados</button>
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
                  {user.first_name} {user.last_name}, Nacimiento: {user.birth_date}
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