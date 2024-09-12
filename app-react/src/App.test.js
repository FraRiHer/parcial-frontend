import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('submits the form and adds a user', async () => {
  render(<App />);

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

  // Puedes agregar aquí expectativas para verificar si el formulario se envió correctamente
});