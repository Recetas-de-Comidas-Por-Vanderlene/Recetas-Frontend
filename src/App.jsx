// src/App.js

import React, { useState, useEffect } from 'react';
// Eliminamos los imports de: Routes, Route, useNavigate, Navigate
// Eliminamos los imports de: SectionIntro, CountryFilter, AllRecipes, RecipeDetail, EditRecipe, RecipeForm
import Hero from './pages/Hero.jsx';
import NavBar from './pages/NavBar.jsx';
import Login from './components/Login/Login';
import Register from './components/Register/Register.jsx';
import FooterImage from './pages/FooterImage.jsx';
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {

  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );
  // ... (useEffect para theme y toggleTheme) ...
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };
  // ----------------------------------------------------
  
  // Eliminamos el estado 'mainView' y sus handlers, ya que la navegación la controla el router
  // const [mainView, setMainView] = useState(VIEWS.HOME);
  // const handleViewHome = () => setMainView(VIEWS.HOME); // Se eliminan
  // const handleViewAllRecipes = () => setMainView(VIEWS.ALL_RECIPES); // Se eliminan
  // const handleViewRecipeForm = () => { ... } // Se eliminan o se simplifican si son necesarios
  // const handleRecipeSuccess = () => { setMainView(VIEWS.HOME); }; // Se modifica

  const [currentAuthView, setCurrentAuthView] = useState('hidden');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nombre, setNombre] = useState("");
  const [successMessage, setSuccessMessage] = useState(''); 
  
  const handleLoginSuccess = (data) => {
    setNombre(data.nombre || "");
    setIsLoggedIn(true);
    setCurrentAuthView('hidden');
  };
  
  const handleRegisterSuccess = () => {
    setSuccessMessage('✅ ¡Registro completado con éxito! Ahora puedes iniciar sesión.');
    setCurrentAuthView('hidden'); 
    setTimeout(() => {
      setSuccessMessage(''); 
      setCurrentAuthView('login'); 
    }, 2000); 
  }
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setNombre("");
  };

  const handleRecipeSuccess = () => {
    // Ya no necesitamos setMainView, el router se encargará de esto con useNavigate si fuera necesario
    // pero por ahora, solo quitamos la modal de login si estuviera activa
    setCurrentAuthView('hidden');
  };
  
  const handleOpenLogin = () => setCurrentAuthView('login');
  const handleNavigateToSignup = () => setCurrentAuthView('register');
  const handleNavigateToLogin = () => setCurrentAuthView('login'); 
  const handleCloseModal = () => {
    setCurrentAuthView('hidden');
    setSuccessMessage('');
  }

  // Eliminamos la definición de Home y ProtectedRoute
  // const Home = () => (...)
  // const ProtectedRoute = ({ children }) => (...)


  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <Hero 
        onUserClick={handleOpenLogin} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <NavBar 
        isLoggedIn={isLoggedIn}
      />

      {/* --- EL BLOQUE <Routes> HA SIDO REEMPLAZADO POR AppRoutes --- */}
      <AppRoutes
        isLoggedIn={isLoggedIn}
        handleOpenLogin={handleOpenLogin} // Necesario para ProtectedRoute
        handleRecipeSuccess={handleRecipeSuccess}
        nombre={nombre} // Necesario para el componente Home
      />
      {/* ----------------------------------------------------------- */}
      
      <FooterImage />

      {/* ... (Lógica de successMessage y modal de Login/Register) ... */}
      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50"> 
          <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow-2xl text-center font-semibold text-lg animate-pulse">
            {successMessage}
          </div>
        </div>
      )}

      
      {currentAuthView !== 'hidden' && !isLoggedIn && !successMessage && (
  
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50"> 
          <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-lg modal-sm-custom"> 
          
            <button
              className="absolute top-0.5 right-0.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs p-1"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            
            {currentAuthView === 'login' ? (
              <Login 
                onLoginSuccess={handleLoginSuccess} 
                onNavigateToSignup={handleNavigateToSignup} 
              />
            ) : (
              <Register 
                onSignupSuccess={handleRegisterSuccess}
                onNavigateToLogin={handleNavigateToLogin}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;