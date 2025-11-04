// ====================================================================
// 1. MOCKING DEL SERVICIO DE AUTENTICACIÓN
// ====================================================================
import { login } from '../../services/auth'; 
jest.mock('../../services/auth', () => ({
  login: jest.fn(),
}));

// ====================================================================
// 2. IMPORTACIONES Y MOCKING DE LOCALSTORAGE
// ====================================================================
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login'; 

// Simulación de localStorage para el entorno de prueba
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// ====================================================================
// 3. ESTRUCTURA Y CASOS DE PRUEBA
// ====================================================================

describe('Componente Login', () => {
  const mockLogin = login; 
  const mockOnLoginSuccess = jest.fn();
  const mockOnNavigateToSignup = jest.fn();

  beforeEach(() => {
    mockLogin.mockClear();
    mockOnLoginSuccess.mockClear();
    mockOnNavigateToSignup.mockClear();
    localStorageMock.clear(); 
  });

  // --- Caso de Prueba 1: Flujo Exitoso (PASA) ---
  test('debe simular un login exitoso, guardar token y llamar a onLoginSuccess', async () => {
    const MOCK_API_RESPONSE = { token: 'fake-token-123', id: 99, username: 'test' };
    mockLogin.mockResolvedValue(MOCK_API_RESPONSE);

    render(
      <Login 
        onLoginSuccess={mockOnLoginSuccess} 
        onNavigateToSignup={mockOnNavigateToSignup} 
      />
    );

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: /Ingresar/i });

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.click(submitButton);

    // Usamos findByText o waitFor para esperar que la aserción de la API se complete
    // Usamos findByText para asegurar que el elemento se cargue asíncronamente
    await screen.findByRole('button', { name: /Ingresar/i }); 
    
    // Verificaciones de éxito
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockOnLoginSuccess).toHaveBeenCalledWith(MOCK_API_RESPONSE);
    expect(localStorage.setItem).toHaveBeenCalledWith('jwtToken', 'fake-token-123');
  });

  // --- Caso de Prueba 2: Flujo Fallido (CORREGIDO) ---
  test('debe mostrar el mensaje de error si las credenciales son incorrectas', async () => {
    // La promesa es rechazada, forzando la ejecución del catch
    mockLogin.mockRejectedValue(new Error('Credenciales inválidas')); 

    render(
      <Login 
        onLoginSuccess={mockOnLoginSuccess} 
        onNavigateToSignup={mockOnNavigateToSignup} 
      />
    );

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: /Ingresar/i });
    
    // 🔥🔥 CORRECCIÓN: Usar credenciales "incorrectas"
    fireEvent.change(emailInput, { target: { value: 'wrong@user.com' } }); 
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    
    fireEvent.click(submitButton);

    // 🚀 Optimización: Usamos findByText, que espera automáticamente a que el elemento aparezca.
    const errorMessage = await screen.findByText(/Usuario o contraseña incorrectos/i);
    
    // Verificaciones de fallo
    expect(errorMessage).toBeInTheDocument();
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
  
  // --- Caso de Prueba 3: Navegación (PASA) ---
  test('debe llamar a onNavigateToSignup al hacer clic en el botón de Registrarse', () => {
    render(
      <Login 
        onLoginSuccess={mockOnLoginSuccess} 
        onNavigateToSignup={mockOnNavigateToSignup} 
      />
    );

    const signupButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(signupButton);

    expect(mockOnNavigateToSignup).toHaveBeenCalledTimes(1);
  });
});