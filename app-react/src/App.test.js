import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Simular la respuesta de fetch para evitar la conexión real
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/register')) {
      return Promise.resolve({
        json: () => Promise.resolve({
          first_name: 'John',
          last_name: 'Doe',
          birth_date: '2000-01-01'
        }),
      });
    } else if (url.includes('/users')) {
      return Promise.resolve({
        json: () => Promise.resolve([
          { first_name: 'John', last_name: 'Doe', birth_date: '2000-01-01' }
        ]),
      });
    }
    return Promise.reject(new Error('URL no manejada'));
  });
});

test('submits the form and adds a user', async () => {
  render(<App />);

  // Asegúrate de que estás en la pantalla de registro
  const registerButton = screen.getByRole('button', { name: /Registrar Usuario/i });
  fireEvent.click(registerButton);

  const firstNameInput = screen.getByLabelText(/Nombres:/i);
  const lastNameInput = screen.getByLabelText(/Apellidos:/i);
  const birthDateInput = screen.getByLabelText(/Fecha de nacimiento:/i);
  const passwordInput = screen.getByLabelText(/Password:/i);

  const submitButton = screen.getByRole('button', { name: /Registrar/i });

  fireEvent.change(firstNameInput, { target: { value: 'John' } });
  fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
  fireEvent.change(birthDateInput, { target: { value: '2000-01-01' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  fireEvent.click(submitButton);

  // Simular la carga de los usuarios al hacer clic en "Ver Usuarios Registrados"
  const viewUsersButton = screen.getByRole('button', { name: /Ver Usuarios Registrados/i });
  fireEvent.click(viewUsersButton);

  // Esperar hasta que el usuario aparezca en la lista simulada
  await waitFor(() => {
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });
});

// Nueva prueba para campos vacíos
test('does not submit the form if required fields are empty', async () => {
  render(<App />);

  // Asegúrate de que estás en la pantalla de registro
  const registerButton = screen.getByRole('button', { name: /Registrar Usuario/i });
  fireEvent.click(registerButton);

  const submitButton = screen.getByRole('button', { name: /Registrar/i });

  // Intentar enviar el formulario sin llenar los campos
  fireEvent.click(submitButton);

  // Asegúrate de que no hay usuarios en la lista
  const viewUsersButton = screen.getByRole('button', { name: /Ver Usuarios Registrados/i });
  fireEvent.click(viewUsersButton);

  await waitFor(() => {
    expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
  });
});
