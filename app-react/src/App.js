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
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación extra para asegurarnos de que todos los campos estén llenos
    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.password) {
      console.error('Todos los campos son requeridos');
      return;
    }

    try {
      const response = await fetch('http://ec2-52-2-70-59.compute-1.amazonaws.com:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),  // Enviar los datos con los nombres corregidos
      });
      const data = await response.json();
      console.log('Usuario registrado:', data);

      if (response.ok) {
        setUsers([...users, {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          birthDate: formData.birthDate
        }]);

        setShowRegister(false);

        setFormData({
          firstName: '',
          lastName: '',
          birthDate: '',
          password: '',
        });
      } else {
        console.error('Error al registrar el usuario:', data.message);
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    }
  };

  // Función para obtener los usuarios registrados desde el backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://ec2-52-2-70-59.compute-1.amazonaws.com:5000/users');
      const data = await response.json();

      console.log('Datos recibidos del backend:', data);

      // Limpiar nombres y manejar el formato de fecha
      const cleanedUsers = data.map(user => ({
        firstName: user.first_name.trim(),
        lastName: user.last_name.trim(),
        birthDate: new Date(user.birth_date).toLocaleDateString(), // Formatear la fecha
      }));

      setUsers(cleanedUsers);
      setShowRegister(false);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  return (
    <div className="App">
      <h1>Aplicación de Registro de nuevos Usuarios</h1>
      <div>
        <button onClick={() => setShowRegister(true)}>Registrar Usuario</button>
        <button onClick={fetchUsers}>Ver Usuarios Registrados</button>
      </div>

      {showRegister ? (
        <div>
          <h2>Registro de Usuarios</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="first_name">Nombres:</label>
              <input
                id="first_name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="last_name">Apellidos:</label>
              <input
                id="last_name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="birth_date">Fecha de nacimiento:</label>
              <input
                id="birth_date"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
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
                  {user.firstName} {user.lastName}, 
                  Nacimiento: {user.birthDate}
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
