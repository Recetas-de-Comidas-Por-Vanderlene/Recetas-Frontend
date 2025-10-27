import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8080';

const toggleFavorite = (recipeId) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const idStr = String(recipeId);
    if (favorites.includes(idStr)) {
        favorites = favorites.filter(id => id !== idStr);
    } else {
        favorites.push(idStr);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return favorites;
};

// 🚨 Nueva prop currentUserName es crítica para el filtro 🚨
const AllRecipes = ({ isLoggedIn, onNavigateToCreate, currentUserName }) => {
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // 🚨 NUEVO ESTADO: controla el filtro principal: 'all' (por defecto) o 'my' 🚨
    const [filterType, setFilterType] = useState('all'); 
    // Mantenemos el estado 'view' para favoritos localmente dentro de cada filterType
    const [view, setView] = useState('all'); // 'all' o 'favorites'

    // Restablecer el sub-filtro (view) al cambiar el filtro principal (filterType)
    useEffect(() => {
        setView('all'); 
    }, [filterType]);


    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites.map(String));

        const fetchRecipes = async () => {
            const token = localStorage.getItem('jwtToken'); 
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/recetas`, {
                    credentials: 'include',
                    headers: headers,
                });
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                const data = await response.json();
                setRecipes(data); 
                setError(null);
            } catch (err) {
                console.error("Error al obtener las recetas:", err);
                setError("No se pudieron cargar las recetas. Verifica tu backend y la consola para más detalles.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, [isLoggedIn]);

    const handleFavoriteClick = (recipeId) => {
        if (!isLoggedIn) {
            alert("🔒 Debes iniciar sesión para guardar favoritos.");
            return;
        }
        const newFavorites = toggleFavorite(recipeId);
        setFavorites(newFavorites.map(String));
    };


    // 🚨 LÓGICA DE FILTRADO COMBINADO 🚨
    let baseRecipes;

    if (filterType === 'my') {
        // Filtrar solo las recetas donde el autor es el usuario logueado
        baseRecipes = recipes.filter(recipe => 
             // CRÍTICO: Compara el nombre del autor de la receta con el nombre del usuario logueado
             recipe.autorNombre === currentUserName 
        );
    } else {
        // Mostrar todas las recetas
        baseRecipes = recipes;
    }

    // Aplicar el sub-filtro (Favoritos o Todas) a la lista base
    const displayedRecipes = view === 'favorites'
        ? baseRecipes.filter(recipe => favorites.includes(String(recipe.id)))
        : baseRecipes;

    // 3. Título Dinámico
    const pageTitle = filterType === 'my' ? 'Mis Recetas Creadas' : 'Recetas del Mundo ';


    if (isLoading) return <div className="text-center p-12 text-lg text-gray-500">Cargando recetas...</div>;
    if (error) return <div className="text-center p-12 text-lg text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {pageTitle}
                </h1>
                
                {/* Botón Crear Receta (aparece si está logueado) */}
                {isLoggedIn && onNavigateToCreate && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onNavigateToCreate} 
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-colors duration-300 flex items-center space-x-2 text-sm"
                    >
                        <span>+ Crear Receta</span>
                    </motion.button>
                )}
            </div>

            {/* 🚨 NUEVOS BOTONES DE FILTRO EN LA VISTA ALLRECIPES 🚨 */}
            <div className="flex justify-center space-x-4 mb-10">
                
                {/* Botón Todas las recetas */}
                <button
                    onClick={() => setFilterType('all')}
                    className={`px-5 py-2 rounded-full font-medium transition-all duration-300 transform
                        ${filterType === 'all'
                            ? 'bg-gray-900 text-white scale-105'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                >
                    Todas las recetas
                </button>
                
                {/* 🚨 Botón Mis Recetas (solo si está logueado) 🚨 */}
                {isLoggedIn && (
                    <button
                        onClick={() => setFilterType('my')}
                        className={`px-5 py-2 rounded-full font-medium transition-all duration-300 transform
                            ${filterType === 'my'
                                ? 'bg-orange-500 text-white scale-105'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        Mis Recetas
                    </button>
                )}

                {/* Botón Favoritos (actúa como sub-filtro) */}
                <button
                    onClick={() => setView(view === 'favorites' ? 'all' : 'favorites')}
                    className={`px-5 py-2 rounded-full font-medium transition-all duration-300 transform
                        ${view === 'favorites'
                            ? 'bg-red-500 text-white scale-105'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                >
                    {view === 'favorites' ? '❤️ Favoritos' : '🤍 Favoritos'}
                </button>
            </div>

            {/* Lista de Recetas */}
            <AnimatePresence mode="wait">
                <motion.div
                    // Cambiar la key asegura que la animación se ejecute al cambiar de filtro principal (filterType)
                    key={filterType + view} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {displayedRecipes.length > 0 ? (
                        displayedRecipes.map(recipe => {
                            const recipeIdStr = String(recipe.id);
                            const isFavorite = favorites.includes(recipeIdStr);

                            return (
                                <motion.div
                                    key={recipe.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="relative p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
                                >
                                    {/* ... (Contenido de la tarjeta de receta sin cambios) ... */}
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleFavoriteClick(recipe.id)}
                                        className="absolute top-4 right-4 text-2xl focus:outline-none"
                                    >
                                        <motion.span
                                            animate={{ scale: isFavorite ? 1.3 : 1 }}
                                            transition={{ duration: 0.2 }}
                                            className={`${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                        >
                                            {isFavorite ? '❤️' : '🤍'}
                                        </motion.span>
                                    </motion.button>
                                    {recipe.fotoUrl ? (
                                        <img
                                            src={recipe.fotoUrl}
                                            alt={recipe.titulo}
                                            className="w-full h-40 object-cover rounded-lg mb-4"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-sm">
                                            Sin imagen
                                        </div>
                                    )}

                                    <div>
                                        <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">
                                            {recipe.titulo}
                                        </h2>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            {recipe.descripcion}
                                        </p>

                                        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                            <p>⏱️ <strong>{recipe.duracionMinutos}</strong> min</p>
                                            <p>📈 Dificultad: <strong>{recipe.dificultad}</strong></p>
                                            <p>⭐ Valoración: {recipe.valoracion?.toFixed(1) || '0.0'}</p>
                                            <p>📅 Publicado: {recipe.fechaPublicacion}</p>
                                            <p>🌍 País: {recipe.paisNombre || 'Desconocido'}</p>
                                            <p>👨‍🍳 Autor: 
                                                <span className={recipe.autorNombre === currentUserName && filterType === 'my' ? 'font-bold text-orange-500' : ''}>
                                                    {recipe.autorNombre || 'Anónimo'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <p className="col-span-full text-center text-gray-500">
                            {view === 'favorites'
                                ? 'No tienes recetas favoritas en esta vista.'
                                : filterType === 'my'
                                    ? 'Aún no has creado ninguna receta.' 
                                    : 'No hay recetas disponibles.'}
                        </p>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AllRecipes;