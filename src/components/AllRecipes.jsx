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

const AllRecipes = ({ isLoggedIn }) => {
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('all'); // 'all' o 'favorites'

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites.map(String));

        const fetchRecipes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/recetas`, {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                const data = await response.json();
                setRecipes(data);
            } catch (err) {
                setError("No se pudieron cargar las recetas.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const handleFavoriteClick = (recipeId) => {
        if (!isLoggedIn) {
            alert("🔒 Debes iniciar sesión para guardar favoritos.");
            return;
        }
        const newFavorites = toggleFavorite(recipeId);
        setFavorites(newFavorites.map(String));
    };

    if (isLoading) return <div className="text-center p-12 text-lg text-gray-500">Cargando recetas...</div>;
    if (error) return <div className="text-center p-12 text-lg text-red-500">{error}</div>;

    const displayedRecipes = view === 'favorites'
        ? recipes.filter(recipe => favorites.includes(String(recipe.id)))
        : recipes;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
                Recetas del Mundo 🌎
            </h1>

            {/* Botones para alternar vistas */}
            <div className="flex justify-center space-x-4 mb-10">
                <button
                    onClick={() => setView('all')}
                    className={`px-5 py-2 rounded-full font-medium transition-all duration-300 transform
                        ${view === 'all'
                            ? 'bg-gray-900 text-white scale-105'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                >
                    Todas las recetas
                </button>

                <button
                    onClick={() => setView('favorites')}
                    className={`px-5 py-2 rounded-full font-medium transition-all duration-300 transform
                        ${view === 'favorites'
                            ? 'bg-gray-900 text-white scale-105'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                >
                    Favoritos
                </button>
            </div>

            {/* Lista con animación */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
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
                                    {/* Ícono de corazón */}
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

                                    {/* Imagen (si existe) */}
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

                                    {/* Contenido de la receta */}
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
                                            <p>👨‍🍳 Autor: {recipe.autorNombre || 'Anónimo'}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <p className="col-span-full text-center text-gray-500">
                            {view === 'favorites'
                                ? 'No tienes recetas favoritas aún.'
                                : 'No hay recetas disponibles.'}
                        </p>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AllRecipes;
