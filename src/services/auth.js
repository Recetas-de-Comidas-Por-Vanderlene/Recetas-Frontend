// src/services/auth.js (Alterado)

const API_URL = 'http://localhost:8080/api/auth';

// 1. Función para Iniciar Sesión
export async function login(email, password) {
 try {
  const response = await fetch(`${API_URL}/login`, {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json'
   },
   body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
   // Captura mensajes de error del backend (si los hay)
//    const errorData = await response.json();
//    throw new Error(errorData.message || 'Login failed');
throw new Error('Login failed');
  }

  const data = await response.json();
  return data;
 } catch (error) {
  throw error;
 }
}


// 2. NUEVA FUNCIÓN para Registrar Usuario
export async function register(nombre, email, password) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password }) // Envía los datos requeridos
        });

        if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message || 'Registro fallido.');
        }

        const data = await response.json();
        return data; // Puede devolver un token o mensaje de éxito
    } catch (error) {
        throw error;
    }
}