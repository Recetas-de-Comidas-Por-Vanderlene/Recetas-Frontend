// src/AppRoutes.jsx

// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// CORRECCIÓN: Agregar '../' para subir de 'routes' a 'src'
import SectionIntro from '../pages/SectionIntro'; // Corregido
import CountryFilter from '../pages/CountryFilter'; // Corregido
import AllRecipes from '../components/Recipes/AllRecipes'; // Corregido
import RecipeDetail from '../components/Recipes/RecipeDetail'; // Corregido
import EditRecipe from '../components/Recipes/EditRecipe'; // Corregido
import RecipeForm from '../components/Recipes/RecipeForm'; // Corregido

const Home = ({ nombre }) => (
  <main>
    <section className="py-12 px-4 md:px-8">
      <SectionIntro username={nombre} />
    </section>
    <section className="py-12">
      <CountryFilter />
    </section>
  </main>
);

// Componente para manejar las Rutas
const AppRoutes = ({ isLoggedIn, handleOpenLogin, handleRecipeSuccess, nombre }) => {
  
  // Componente ProtectedRoute que tenías en App.js
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      handleOpenLogin();
      // Usamos <Navigate> aquí para redirigir
      return <Navigate to="/" replace />; 
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Home nombre={nombre} />} />
      
      <Route path="/recetas" element={
        <div className="py-12 px-4 md:px-8">
          <AllRecipes isLoggedIn={isLoggedIn} />
        </div>
      } />
      
      <Route path="/receta/:id" element={<RecipeDetail isLoggedIn={isLoggedIn} />} />
      
      {/* Rutas Protegidas */}
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
  );
};

export default AppRoutes;