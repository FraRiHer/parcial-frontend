import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    rentalDate: '',
    customerId: '',
    filmId: '',
  });

  const [movies, setMovies] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [showRentalForm, setShowRentalForm] = useState(true);

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Obtener las películas del backend
  const fetchMovies = async () => {
    try {
      const response = await fetch('http://ec2-52-20-174-31.compute-1.amazonaws.com:5000/movies');
      const data = await response.json();
      console.log(data); // Depurar la respuesta de la API
      if (data.data) {
        setMovies(data.data); // Asegurarse de que la clave 'data' esté presente
      } else {
        console.error('Error al obtener las películas:', data.message);
      }
    } catch (error) {
      console.error('Error al obtener las películas:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Verificar el estado de movies
  useEffect(() => {
    console.log(movies); // Depurar el estado de movies
  }, [movies]);

  // Manejo del envío del formulario de rentas
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.rentalDate || !formData.customerId || !formData.filmId) {
      console.error('Todos los campos son requeridos');
      return;
    }

    try {
      const response = await fetch('http://ec2-52-20-174-31.compute-1.amazonaws.com:5000/add-rental', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rental_date: formData.rentalDate,
          customer_id: formData.customerId,
          film_id: formData.filmId,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setRentals([...rentals, {
          rentalDate: formData.rentalDate,
          customerId: formData.customerId,
          filmId: formData.filmId,
        }]);
        setShowRentalForm(false);
        setFormData({
          rentalDate: '',
          customerId: '',
          filmId: '',
        });
      } else {
        console.error('Error al registrar la renta:', data.message);
      }
    } catch (error) {
      console.error('Error al registrar la renta:', error);
    }
  };

  // Función para obtener las rentas registradas desde el backend
  const fetchRentals = async () => {
    if (!formData.customerId) {
      console.error('Debe ingresar un ID de cliente para ver sus rentas');
      return;
    }

    try {
      const response = await fetch('http://ec2-52-20-174-31.compute-1.amazonaws.com:5000/get-movies/' + formData.customerId);
      const data = await response.json();
      if (data.status === "success") {
        setRentals(data.data);
        setShowRentalForm(false);
      } else {
        console.error('Error al obtener las rentas:', data.message);
      }
    } catch (error) {
      console.error('Error al obtener las rentas:', error);
    }
  };

  return (
    <div className="App">
      <h1>Aplicación de Registro de Rentas</h1>
      <div>
        <button onClick={() => setShowRentalForm(true)}>Registrar Renta</button>
        <button onClick={fetchRentals}>Ver Rentas Registradas</button>
      </div>

      {showRentalForm ? (
        <div>
          <h2>Registro de Rentas</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="rental_date">Fecha de Renta:</label>
              <input
                id="rental_date"
                type="date"
                name="rentalDate"
                value={formData.rentalDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="customer_id">Documento del Cliente:</label>
              <input
                id="customer_id"
                type="text"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="film_id">Película:</label>
              <select
                id="film_id"
                name="filmId"
                value={formData.filmId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una película</option>
                {movies.map((movie) => (
                  <option key={movie.film_id} value={movie.film_id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Registrar Renta</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Rentas Registradas</h2>
          {rentals.length === 0 ? (
            <p>No hay rentas registradas aún.</p>
          ) : (
            <ul>
              {rentals.map((rental, index) => (
                <li key={index}>
                  Fecha de Renta: {rental.rentalDate}, Cliente: {rental.customerId}, Película: {rental.filmId}
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