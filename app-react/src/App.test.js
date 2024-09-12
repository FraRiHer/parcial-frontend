import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders registration form', () => {
  render(<App />);
  const registerButton = screen.getByText(/Registrar Usuario/i);
  expect(registerButton).toBeInTheDocument();
});

test('submits the form and adds a user', async () => {
  render(<App />);
  const firstNameInput = screen.getByLabelText(/Nombres:/i);
  const lastNameInput = screen.getByLabelText(/Apellidos:/i);
  const birthDateInput = screen.getByLabelText(/Fecha de nacimiento:/i);
  const passwordInput = screen.getByLabelText(/Password:/i);
  const submitButton = screen.getByText(/Registrar/i);

  fireEvent.change(firstNameInput, { target: { value: 'John' } });
  fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
  fireEvent.change(birthDateInput, { target: { value: '1990-01-01' } });
  fireEvent.change(passwordInput, { target: { value: 'password' } });

  fireEvent.click(submitButton);

  const user = await screen.findByText(/John Doe/i);
  expect(user).toBeInTheDocument();
});