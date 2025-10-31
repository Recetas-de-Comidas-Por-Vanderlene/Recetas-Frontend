import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import NavBar from './components/NavBar';
import SectionIntro from './components/SectionIntro';
import CountryFilter from './components/CountryFilter';
import FooterImage from './components/FooterImage';
import Login from './components/Login';
import Register from './components/Register';
import RecipeForm from './components/RecipeForm';
import AllRecipes from './components/AllRecipes';
import RecipeDetail from './components/RecipeDetail';
import EditRecipe from './components/EditRecipe';

const VIEWS = {
  HOME: 'home',
  RECIPE_FORM: 'recipeForm',
  ALL_RECIPES: 'allRecipes',
};


function App() {

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
  
  
  const [mainView, setMainView] = useState(VIEWS.HOME);
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
    setMainView(VIEWS.HOME); 
  };

 
  const handleViewHome = () => setMainView(VIEWS.HOME);
  
  const handleViewAllRecipes = () => setMainView(VIEWS.ALL_RECIPES);
  

  const handleViewRecipeForm = () => {
    if (isLoggedIn) {
      setMainView(VIEWS.RECIPE_FORM);
    } else {
      setCurrentAuthView('login'); 
    }
  };
  
  const handleRecipeSuccess = () => {
    setMainView(VIEWS.HOME);
  };
  
  const handleOpenLogin = () => setCurrentAuthView('login');
  const handleNavigateToSignup = () => setCurrentAuthView('register');
  const handleNavigateToLogin = () => setCurrentAuthView('login'); 
  const handleCloseModal = () => {
    setCurrentAuthView('hidden');
    setSuccessMessage('');
  }

  const Home = () => (
    <main>
      <section className="py-12 px-4 md:px-8">
        <SectionIntro username={nombre} />
      </section>
      <section className="py-12">
        <CountryFilter />
      </section>
    </main>
  );

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      handleOpenLogin();
      return <Navigate to="/" />;
    }
    return children;
  };
  

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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recetas" element={
          <div className="py-12 px-4 md:px-8">
            <AllRecipes isLoggedIn={isLoggedIn} />
          </div>
        } />
        <Route path="/receta/:id" element={<RecipeDetail isLoggedIn={isLoggedIn} />} />
        <Route path="/recetas/:id/editar" element={
          <ProtectedRoute>
            <EditRecipe />
          </ProtectedRoute>
        } />
        <Route path="/crear-receta" element={
          <ProtectedRoute>
            <div className="py-12 px-4 md:px-8">
              <RecipeForm onRecipeSuccess={handleRecipeSuccess} />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
      
      <FooterImage />

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