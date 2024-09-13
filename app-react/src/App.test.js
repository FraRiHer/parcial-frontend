import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Simular la respuesta de fetch para evitar la conexión real
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/register')) {
      return Promise.resolve({
        json: () => Promise.resolve({ message: 'Usuario registrado' }),
      });
    } else if (url.includes('/users')) {
      return Promise.resolve({
        json: () => Promise.resolve([{ firstName: 'John', lastName: 'Doe', birthDate: '2000-01-01' }]),
      });
    }
    return Promise.reject(new Error('URL no manejada'));
  });
});

test('submits the form and adds a user', async () => {
  render(<App />);

  const firstNameInput = screen.getByLabelText(/Nombres:/i);
  const lastNameInput = screen.getByLabelText(/Apellidos:/i);
  const birthDateInput = screen.getByLabelText(/Fecha de nacimiento:/i);
  const passwordInput = screen.getByLabelText(/Password:/i);

  const buttons = screen.getAllByRole('button', { name: /Registrar/i });
  const submitButton = buttons[1]; // El botón de registro en el formulario

  fireEvent.change(firstNameInput, { target: { value: 'John' } });
  fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
  fireEvent.change(birthDateInput, { target: { value: '2000-01-01' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  fireEvent.click(submitButton);

  // Esperar hasta que el usuario aparezca en la lista simulada
  await waitFor(() => {
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });
});