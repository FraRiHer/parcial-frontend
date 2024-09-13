import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('submits the form and adds a user', async () => {
  render(<App />);

  const firstNameInput = screen.getByLabelText(/Nombres:/i);
  const lastNameInput = screen.getByLabelText(/Apellidos:/i);
  const birthDateInput = screen.getByLabelText(/Fecha de nacimiento:/i);
  const passwordInput = screen.getByLabelText(/Password:/i);

  // Obtiene todos los botones que coinciden con el texto "Registrar"
  const buttons = screen.getAllByRole('button', { name: /Registrar/i });
  
  // El botón de registro en el formulario es el segundo, por lo que seleccionamos el índice 1
  const submitButton = buttons[1];

  fireEvent.change(firstNameInput, { target: { value: 'John' } });
  fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
  fireEvent.change(birthDateInput, { target: { value: '2000-01-01' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  fireEvent.click(submitButton);

  // Esperar hasta que el usuario aparezca en la lista
  await waitFor(() => {
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });
});
