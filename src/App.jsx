import React, { useState, useEffect } from 'react'; 
import Hero from './components/Hero';
import NavBar from './components/NavBar';
import SectionIntro from './components/SectionIntro';
import CountryFilter from './components/CountryFilter';
import FooterImage from './components/FooterImage';
import Login from './components/Login';
import Register from './components/Register'; 
import RecipeForm from './components/RecipeForm'; 
import AllRecipes from './components/AllRecipes'; 

// Definimos los tipos de vista principal que podemos tener
const VIEWS = {
  HOME: 'home',
  RECIPE_FORM: 'recipeForm',
  ALL_RECIPES: 'allRecipes',
};


function App() {
  // ----------------------------------------------------
  // LÓGICA DEL MODO CLARO/OSCURO
  // ----------------------------------------------------
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

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
  
  // ESTADOS DE AUTENTICACIÓN Y VISTA
  const [mainView, setMainView] = useState(VIEWS.HOME);
  const [currentAuthView, setCurrentAuthView] = useState('hidden');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nombre, setNombre] = useState("");
  const [successMessage, setSuccessMessage] = useState(''); 
  
  // --- Funciones de AUTH ---
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
    setMainView(VIEWS.HOME); 
  };

  // --- Funciones para cambiar la vista principal ---
  const handleViewHome = () => setMainView(VIEWS.HOME);
  
  const handleViewAllRecipes = () => setMainView(VIEWS.ALL_RECIPES);
  
  // Esta es la función que queremos pasar al botón "Crear Receta"
  const handleViewRecipeForm = () => {
    if (isLoggedIn) {
      setMainView(VIEWS.RECIPE_FORM);
    } else {
      setCurrentAuthView('login'); // Pide login si no está logueado
    }
  };
  
  const handleRecipeSuccess = () => {
    setMainView(VIEWS.HOME);
  };
  
  // --- Funciones de Navegación/Modal ---
  const handleOpenLogin = () => setCurrentAuthView('login');
  const handleNavigateToSignup = () => setCurrentAuthView('register');
  const handleNavigateToLogin = () => setCurrentAuthView('login'); 
  const handleCloseModal = () => {
    setCurrentAuthView('hidden');
    setSuccessMessage('');
  }

  // --- Renderizado Condicional del Contenido Principal ---
  const renderMainContent = () => {
    if (mainView === VIEWS.RECIPE_FORM) {
      return (
        <div className="py-12 px-4 md:px-8">
          <RecipeForm onRecipeSuccess={handleRecipeSuccess} />
        </div>
      );
    }
    
    if (mainView === VIEWS.ALL_RECIPES) { 
      return (
        <div className="py-12 px-4 md:px-8">
          {/* 🚨 AÑADIDO: Pasamos la función al componente AllRecipes 🚨 */}
          <AllRecipes 
                        isLoggedIn={isLoggedIn} 
                        onNavigateToCreate={handleViewRecipeForm} 
                    /> 
        </div>
      );
    }
    
    return (
      <main>
        <section className="py-12 px-4 md:px-8">
          <SectionIntro username={nombre} />
        </section>

        <section className="py-12">
          <CountryFilter />
        </section>
      </main>
    );
  };
  // --------------------------------------------------------

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
        onNavigateHome={handleViewHome}
        onNavigateRecipeForm={handleViewRecipeForm}
        onNavigateAllRecipes={handleViewAllRecipes}
      />

      {renderMainContent()}
      
      <FooterImage />

      {/* MOSTRAR EL MENSAJE DE ÉXITO DE REGISTRO */}
      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50"> 
          <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow-2xl text-center font-semibold text-lg animate-pulse">
            {successMessage}
          </div>
        </div>
      )}

      {/* MODAL DE LOGIN/REGISTER (POSICIONADO ARRIBA A LA DERECHA) */}
      {currentAuthView !== 'hidden' && !isLoggedIn && !successMessage && (
        // CONTENEDOR EXTERNO: Solo es la capa negra (opacity-50)
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50"> 
          {/* CONTENEDOR INTERIOR: Posicionamiento 'popover' y tamaño mínimo */}
          <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-lg modal-sm-custom"> 
            
            {/* Botón de cierre más pequeño */}
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