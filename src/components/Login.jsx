import { useState } from "react";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://tu-backend.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) onLoginSuccess(data);
      else setError(data.message || "Usuario o contraseña incorrectos");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {error && <p className="text-yellow-200 text-center">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 text-black placeholder-gray-500 transition-colors"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="p-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 text-black placeholder-gray-500 transition-colors"
      />

      <button
        type="submit"
        className="mt-2 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
      >
        Ingresar
      </button>
    </form>
  );
}
