// src/components/Login.jsx (Código Final Minimalista y Compacto)

import { useState } from "react";
import { login } from "../services/auth"; 

export default function Login({ onLoginSuccess, onNavigateToSignup }) {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");

const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      onLoginSuccess(data);
    } catch (error) {
      setError("Usuario o contraseña incorrectos");
    }
  };

 return (
  
  <form onSubmit={handleLogin} className="flex flex-col gap-1">
   {/* Título simple y compacto */}
   <h3 className="text-xl font-semibold mb-2 text-center">Acceder</h3>
   {error && <p className="text-red-500 text-xs text-center">{error}</p>} 

   {/* INPUT COMPACTO: p-1.5 */}
   <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="p-1.5 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-400 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
   />

   {/* INPUT COMPACTO: p-1.5 */}
   <input
    type="password"
    placeholder="Contraseña"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    className="p-1.5 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-400 text-black dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm"
   />

   <button
    type="submit"
     /* BOTÓN COMPACTO: py-1.5 */
    className="mt-2 bg-orange-500 text-white font-bold py-1.5 rounded-md hover:bg-orange-600 transition-colors text-sm"
   >
    Ingresar
   </button>
      
   <button
    type="button" 
    onClick={onNavigateToSignup} 
     /* BOTÓN COMPACTO: py-1.5 */
    className="bg-blue-600 text-white font-bold py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm"
   >
    Registrarse
   </button>
  </form>
 );
}