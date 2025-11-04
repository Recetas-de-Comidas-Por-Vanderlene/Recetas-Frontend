// File: AllRecipes.vibrant.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { FaHeart } from 'react-icons/fa';

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

const ripple = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 20 } }
};

const cardVariants = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
    hover: { scale: 1.03, boxShadow: '0 14px 40px rgba(16,24,40,0.12)' }
};

const AllRecipes = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('all');
    const [selectedCountry, setSelectedCountry] = useState('Todos');
    const [countries, setCountries] = useState([]);

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

            let url = `${API_BASE_URL}/api/recetas`;
            if (view === 'my') {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError("No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.");
                    setRecipes([]);
                    setIsLoading(false);
                    return;
                }
                url = `${API_BASE_URL}/api/recetas/usuario/${userId}`;
            }

            try {
                setIsLoading(true);
                const response = await fetch(url, {
                    credentials: 'include',
                    headers: headers,
                });
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                const data = await response.json();
                setRecipes(data);
                setError(null);

                // ✅ Extraer países correctamente
                const countries = [...new Set(data.map(r => {
                    if (r.pais && typeof r.pais === 'object' && r.pais.nombre) return r.pais.nombre;
                    if (typeof r.pais === 'string') return r.pais;
                    return 'Desconocido';
                }))];
                setCountries(['Todos', ...countries]);

            } catch (err) {
                setError("No se pudieron cargar las recetas. Verifica tu conexión y vuelve a intentar.");
                console.error("Error al cargar recetas:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, [view]);

    const handleFavoriteClick = (recipeId) => {
        if (!isLoggedIn) {
            alert("🔒 Debes iniciar sesión para guardar favoritos.");
            return;
        }
        const newFavorites = toggleFavorite(recipeId);
        setFavorites(newFavorites.map(String));
    };

    if (isLoading) return (
        <div className="min-h-[40vh] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ loop: Infinity, ease: 'linear', duration: 1 }} className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-yellow-400" />
        </div>
    );
    if (error) return <div className="text-center p-12 text-lg text-red-500">{error}</div>;

    const displayedRecipes = (view === 'favorites'
        ? recipes.filter(recipe => favorites.includes(String(recipe.id)))
        : recipes
    ).filter(r => {
        const countryName = r.pais && typeof r.pais === 'object' ? r.pais.nombre : r.pais;
        return selectedCountry === 'Todos' || countryName === selectedCountry;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="w-full sm:w-auto">
                    <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-600 to-yellow-400 text-center sm:text-left">
                        Recetas del Mundo
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
                        Sabor, color y movimiento en cada receta.
                    </p>
                </div>

                {/* 🔥 Bloque responsive */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
                    
                    {/* botones de vista */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 bg-white/60 dark:bg-gray-800/60 rounded-full p-1 shadow-sm w-full sm:w-auto">
                        <button onClick={() => setView('all')} className={`px-4 py-1 rounded-full text-sm ${view === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-200'}`}>Todas</button>
                        {isLoggedIn && <button onClick={() => setView('my')} className={`px-4 py-1 rounded-full text-sm ${view === 'my' ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-200'}`}>Mis recetas</button>}
                        <button onClick={() => setView('favorites')} className={`px-4 py-1 rounded-full text-sm ${view === 'favorites' ? 'bg-indigo-600 text-white flex items-center gap-2' : 'text-gray-700 dark:text-gray-200 flex items-center gap-2'}`}>
                            <FaHeart className={view === 'favorites' ? 'text-rose-300' : 'text-gray-400'} /> Favoritos
                        </button>
                    </div>

                    {/* 🌍 Selector país */}
                    <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                        <label className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">País:</label>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="flex-1 sm:flex-none px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-400"
                        >
                            {countries.map((country, idx) => (
                                <option key={idx} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>

                    {/* ➕ Crear */}
                    {isLoggedIn && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/crear-receta')}
                            className="w-full sm:w-auto px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white shadow-lg"
                        >
                            + Crear
                        </motion.button>
                    )}
                </div>
            </div>

            {/* 📚 Listado de recetas */}
            <AnimatePresence mode="wait">
                <motion.section
                    key={view + selectedCountry}
                    initial="initial"
                    animate="enter"
                    exit="initial"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {displayedRecipes.length > 0 ? displayedRecipes.map(recipe => {
                        const recipeIdStr = String(recipe.id);
                        const isFavorite = favorites.includes(recipeIdStr);
                        const countryName = recipe.pais && typeof recipe.pais === 'object' ? recipe.pais.nombre : recipe.pais;

                        return (
                            <motion.article
                                key={recipe.id}
                                variants={cardVariants}
                                whileHover="hover"
                                className="relative rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700"
                            >
                                <div onClick={() => navigate(`/receta/${recipe.id}`)}>
                                    {recipe.fotoUrl ? (
                                        <motion.img
                                            src={recipe.fotoUrl}
                                            alt={recipe.titulo}
                                            className="w-full h-44 object-cover"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.6 }}
                                        />
                                    ) : (
                                        <div className="w-full h-44 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-400">Sin imagen</div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{recipe.titulo}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{recipe.descripcion}</p>
                                        </div>

                                        <motion.button
                                            onClick={() => handleFavoriteClick(recipe.id)}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 rounded-md focus:outline-none"
                                            aria-label="favorite"
                                        >
                                            <motion.span
                                                initial={{ scale: 1 }}
                                                animate={{ scale: isFavorite ? 1.3 : 1 }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                                className={isFavorite ? 'text-rose-500' : 'text-gray-300'}
                                            >
                                                {isFavorite ? '❤️' : '🤍'}
                                            </motion.span>
                                        </motion.button>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-300">
                                        <div className="flex items-center gap-2">🌍 {countryName || 'Desconocido'}</div>
                                        <div className="flex items-center gap-2">⏱️ <strong>{recipe.duracionMinutos}</strong> min</div>
                                        <div className="flex items-center gap-2">📈 {recipe.dificultad}</div>
                                        <div className="flex items-center gap-2">⭐ {recipe.valoracion?.toFixed(1) || '0.0'}</div>
                                    </div>
                                </div>

                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={ripple}
                                    className="absolute left-0 bottom-0 w-24 h-24 bg-gradient-to-tr from-pink-300 to-yellow-300 opacity-30 blur-3xl pointer-events-none"
                                />
                            </motion.article>
                        );
                    }) : (
                        <p className="col-span-full text-center text-gray-500">
                            {view === 'favorites'
                                ? 'No tienes recetas favoritas aún.'
                                : view === 'my'
                                    ? 'No has creado ninguna receta aún.'
                                    : 'No hay recetas disponibles.'}
                        </p>
                    )}
                </motion.section>
            </AnimatePresence>
        </div>
    );
};

export default AllRecipes;
