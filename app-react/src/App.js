import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estado para los campos del formulario de rentas
  const [formData, setFormData] = useState({
    rentalDate: '',
    customerId: '',
    movieId: '',
  });

  // Estado para almacenar las películas desde el backend
  const [movies, setMovies] = useState([]);

  // Estado para manejar las rentas registradas
  const [rentals, setRentals] = useState([]);

  // Estado para manejar cuál pantalla mostrar (true: formulario de rentas, false: lista de rentas)
  const [showRentalForm, setShowRentalForm] = useState(true);

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Obtener las películas del backend para mostrar en el desplegable
  const fetchMovies = async () => {
    try {
      const response = await fetch('http://ec2-52-2-70-59.compute-1.amazonaws.com:5000/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error al obtener las películas:', error);
    }
  };

  // Cargar las películas cuando se monta el componente
  useEffect(() => {
    fetchMovies();
  }, []);

  // Manejo del envío del formulario de rentas
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación para asegurarnos de que todos los campos estén llenos
    if (!formData.rentalDate || !formData.customerId || !formData.movieId) {
      console.error('Todos los campos son requeridos');
      return;
    }

    try {
      const response = await fetch('http://ec2-52-2-70-59.compute-1.amazonaws.com:5000/rentas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),  // Enviar los datos de la renta
      });

      const data = await response.json();
      console.log('Renta registrada:', data);

      if (response.ok) {
        setRentals([...rentals, {
          rentalDate: formData.rentalDate,
          customerId: formData.customerId,
          movieId: formData.movieId,
        }]);

        setShowRentalForm(false);

        setFormData({
          rentalDate: '',
          customerId: '',
          movieId: '',
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
    try {
      const response = await fetch('http://ec2-52-2-70-59.compute-1.amazonaws.com:5000/rentas');
      const data = await response.json();

      console.log('Datos recibidos del backend:', data);
      setRentals(data);
      setShowRentalForm(false);
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
              <label htmlFor="movie_id">Película:</label>
              <select
                id="movie_id"
                name="movieId"
                value={formData.movieId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una película</option>
                {movies.map((movie) => (
                  <option key={movie.movie_id} value={movie.movie_id}>
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
                  Fecha de Renta: {rental.rentalDate}, Cliente: {rental.customerId}, Película: {rental.movieId}
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
