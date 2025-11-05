// File: AllRecipes.vibrant.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { FaHeart, FaGlobe } from 'react-icons/fa';

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

// Función helper para extraer el nombre del país de manera consistente
const getCountryName = (recipe) => {
    // El backend devuelve el país en el campo 'paisNombre'
    const paisField = recipe.paisNombre || recipe.pais || recipe.country;
    
    if (!paisField) {
        return 'Desconocido';
    }
    if (typeof paisField === 'object' && paisField.nombre) {
        return paisField.nombre;
    }
    if (typeof paisField === 'string') {
        return paisField;
    }
    console.log('DEBUG - Tipo de país no reconocido:', typeof paisField, paisField);
    return 'Desconocido';
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
    const [allRecipes, setAllRecipes] = useState([]); // Para mantener todas las recetas para países
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('all');
    const [selectedCountry, setSelectedCountry] = useState('Todos');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);

    // ✅ Optimización: Usar useMemo para calcular países únicos basado en TODAS las recetas
    const countries = useMemo(() => {
        // Usar allRecipes si está disponible, de lo contrario usar recipes actuales
        const recipesForCountries = allRecipes.length > 0 ? allRecipes : recipes;
        
        if (recipesForCountries.length === 0) {
            console.log('DEBUG - No hay recetas para extraer países');
            return ['Todos'];
        }

        const uniqueCountries = [...new Set(recipesForCountries.map(recipe => getCountryName(recipe)))];
        
        console.log('DEBUG - Países encontrados:', uniqueCountries);
        console.log('DEBUG - Total recetas analizadas:', recipesForCountries.length);
        console.log('DEBUG - Usando allRecipes:', allRecipes.length > 0);
        
        // Filtrar 'Desconocido' y ordenar
        const validCountries = uniqueCountries.filter(country => country !== 'Desconocido').sort();
        
        return ['Todos', ...validCountries];
    }, [allRecipes, recipes]);

    // ✅ Optimización: Usar useMemo para filtrar recetas
    const displayedRecipes = useMemo(() => {
        let filteredRecipes = recipes;

        // Filtrar por vista (solo favoritos necesita filtrado adicional en frontend)
        if (view === 'favorites') {
            filteredRecipes = recipes.filter(recipe => favorites.includes(String(recipe.id)));
        }
        // Las vistas 'all' y 'my' ya vienen filtradas del backend

        // Filtrar por país seleccionado
        if (selectedCountry !== 'Todos') {
            filteredRecipes = filteredRecipes.filter(recipe => {
                const countryName = getCountryName(recipe);
                return countryName === selectedCountry;
            });
        }

        return filteredRecipes;
    }, [recipes, view, favorites, selectedCountry]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites.map(String));
    }, []);

    // ✅ Efecto separado para cargar todas las recetas (solo una vez al montar)
    useEffect(() => {
        const fetchAllRecipesForCountries = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`${API_BASE_URL}/api/recetas`, {
                    credentials: 'include',
                    headers: headers,
                });
                if (response.ok) {
                    const data = await response.json();
                    setAllRecipes(data);
                    console.log('DEBUG - Todas las recetas cargadas para países:', data.length);
                    if (data.length > 0) {
                        console.log('DEBUG - Primer país encontrado:', data[0].paisNombre);
                        console.log('DEBUG - Estructura de la primera receta:', Object.keys(data[0]));
                    }
                }
            } catch (err) {
                console.log('No se pudieron cargar todas las recetas para países:', err);
            }
        };

        fetchAllRecipesForCountries();
    }, []); // Solo ejecutar una vez al montar

    // ✅ Efecto separado para cargar recetas según la vista
    useEffect(() => {
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
                console.log(`DEBUG - Recetas cargadas para vista '${view}':`, data.length);

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

    // Nueva función para eliminar receta
    const handleDeleteRecipe = async (recipeId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const userId = localStorage.getItem('userId');
            
            console.log('DEBUG - Eliminando receta ID:', recipeId);
            console.log('DEBUG - Token disponible:', !!token);
            console.log('DEBUG - Token completo:', token);
            console.log('DEBUG - User ID:', userId);
            console.log('DEBUG - URL de eliminación:', `${API_BASE_URL}/api/recetas/${recipeId}`);
            
            // Verificar si el usuario es el propietario
            const recipe = recipes.find(r => r.id === recipeId);
            console.log('DEBUG - Receta encontrada:', recipe);
            console.log('DEBUG - ID del autor de la receta:', recipe?.autorId || recipe?.usuarioId);
            
            if (!token) {
                throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
            }
            
            // Verificar si el token tiene el formato correcto (Bearer)
            const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            console.log('DEBUG - Authorization header:', authHeader);
            
            const response = await fetch(`${API_BASE_URL}/api/recetas/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            console.log('DEBUG - Response status:', response.status);
            console.log('DEBUG - Response ok:', response.ok);
            console.log('DEBUG - Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                // Intentar leer el mensaje de error del backend
                let errorMessage = 'No se pudo eliminar la receta';
                try {
                    const errorData = await response.text();
                    console.log('DEBUG - Error del backend:', errorData);
                    if (errorData) {
                        errorMessage = `Error ${response.status}: ${errorData}`;
                    } else {
                        errorMessage = `Error HTTP ${response.status}`;
                    }
                } catch (parseErr) {
                    console.log('DEBUG - No se pudo leer el error del backend:', parseErr);
                    errorMessage = `Error HTTP ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            // Actualizar la lista de recetas después de eliminar
            setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
            setAllRecipes(allRecipes.filter(recipe => recipe.id !== recipeId));
            
            // Cerrar modal y limpiar estado
            setShowDeleteConfirm(false);
            setRecipeToDelete(null);
            
            // Mensaje de éxito
            alert('✅ Receta eliminada exitosamente');
        } catch (err) {
            console.error('ERROR completo al eliminar receta:', err);
            alert(`❌ Error: ${err.message}`);
            // No cerrar el modal en caso de error para que el usuario pueda intentar de nuevo
        }
    };

    // Función para confirmar eliminación
    const confirmDelete = (recipe) => {
        setRecipeToDelete(recipe);
        setShowDeleteConfirm(true);
    };

    // Función para cancelar eliminación
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setRecipeToDelete(null);
    };

    if (isLoading) return (
        <div className="min-h-[40vh] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ loop: Infinity, ease: 'linear', duration: 1 }} className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-yellow-400" />
        </div>
    );
    if (error) return <div className="text-center p-12 text-lg text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="w-full sm:w-auto">
                    <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-600 to-yellow-400 text-center sm:text-left">
                        Recetas del Mundo
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
                        {selectedCountry === 'Todos' 
                            ? 'Sabor, color y movimiento en cada receta.' 
                            : `Recetas de ${selectedCountry} - ${displayedRecipes.length} receta${displayedRecipes.length !== 1 ? 's' : ''}`
                        }
                    </p>
                </div>

                {/* 🔥 Bloque responsive */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
                    
                    {/* botones de vista */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 bg-white/60 dark:bg-gray-800/60 rounded-full p-1 shadow-sm w-full sm:w-auto">
                        <button onClick={() => setView('all')} className={`px-4 py-1 rounded-full text-sm transition-all ${view === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Todas</button>
                        {isLoggedIn && <button onClick={() => setView('my')} className={`px-4 py-1 rounded-full text-sm transition-all ${view === 'my' ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Mis recetas</button>}
                        <button onClick={() => setView('favorites')} className={`px-4 py-1 rounded-full text-sm transition-all ${view === 'favorites' ? 'bg-indigo-600 text-white flex items-center gap-2' : 'text-gray-700 dark:text-gray-200 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            <FaHeart className={view === 'favorites' ? 'text-rose-300' : 'text-gray-400'} /> Favoritos
                        </button>
                    </div>

                    {/* 🌍 Selector país */}
                    <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                        <label className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap flex items-center gap-1">
                            <FaGlobe className="text-indigo-500" />
                            País:
                        </label>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="flex-1 sm:flex-none px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                        >
                            {countries.map((country, idx) => (
                                <option key={idx} value={country}>
                                    {country === 'Todos' ? '🌍 Todos los países' : country}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ➕ Crear */}
                    {isLoggedIn && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/crear-receta')}
                            className="w-full sm:w-auto px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white shadow-lg hover:shadow-xl transition-shadow"
                        >
                            + Crear
                        </motion.button>
                    )}
                </div>
            </div>

            {/* � Información de resultados */}
            {selectedCountry !== 'Todos' && (
                <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                        🔍 Mostrando <strong>{displayedRecipes.length}</strong> receta{displayedRecipes.length !== 1 ? 's' : ''} de <strong>{selectedCountry}</strong>
                        {displayedRecipes.length === 0 && (
                            <span className="block mt-1">
                                <button 
                                    onClick={() => setSelectedCountry('Todos')}
                                    className="text-indigo-600 hover:text-indigo-800 underline"
                                >
                                    Ver todas las recetas
                                </button>
                            </span>
                        )}
                    </p>
                </div>
            )}

            {/* �📚 Listado de recetas */}
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
                        const countryName = getCountryName(recipe);
                        const isOwner = isLoggedIn && String(recipe.autorId || recipe.usuarioId) === String(localStorage.getItem('userId'));

                        return (
                            <motion.article
                                key={recipe.id}
                                variants={cardVariants}
                                whileHover="hover"
                                className="relative rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 shadow-sm hover:shadow-lg transition-shadow"
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

                                        <div className="flex flex-col gap-2">
                                            {/* Botón de favoritos */}
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

                                            {/* Botón de eliminar - Solo para el propietario en vista "my" */}
                                            {view === 'my' && isOwner && (
                                                <motion.button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        confirmDelete(recipe);
                                                    }}
                                                    whileTap={{ scale: 0.9 }}
                                                    whileHover={{ scale: 1.1 }}
                                                    className="p-2 rounded-md focus:outline-none hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    aria-label="delete recipe"
                                                >
                                                    <span className="text-red-500 hover:text-red-600 text-lg">
                                                        🗑️
                                                    </span>
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-300">
                                        <div className="flex items-center gap-2">🌍 {countryName}</div>
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
                        <div className="col-span-full text-center py-12">
                            <div className="text-6xl mb-4">
                                {view === 'favorites' ? '💝' : selectedCountry !== 'Todos' ? '🌍' : '📝'}
                            </div>
                            <p className="text-gray-500 text-lg mb-4">
                                {view === 'favorites'
                                    ? 'No tienes recetas favoritas aún.'
                                    : view === 'my'
                                        ? 'No has creado ninguna receta aún.'
                                        : selectedCountry !== 'Todos'
                                            ? `No hay recetas disponibles de ${selectedCountry}.`
                                            : 'No hay recetas disponibles.'}
                            </p>
                            {selectedCountry !== 'Todos' && (
                                <button 
                                    onClick={() => setSelectedCountry('Todos')}
                                    className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
                                >
                                    Ver todas las recetas
                                </button>
                            )}
                        </div>
                    )}
                </motion.section>
            </AnimatePresence>

            {/* ===== Modal de Confirmación de Eliminación ===== */}
            <AnimatePresence>
                {showDeleteConfirm && recipeToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={cancelDelete}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-4 max-w-sm w-full shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="text-4xl mb-2">⚠️</div>
                                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                                    ¿Eliminar receta?
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                    La receta <strong>"{recipeToDelete.titulo}"</strong> será eliminada permanentemente.
                                </p>
                                
                                <div className="flex gap-2 justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={cancelDelete}
                                        className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                    >
                                        Cancelar
                                    </motion.button>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDeleteRecipe(recipeToDelete.id)}
                                        className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                                    >
                                        Eliminar
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllRecipes;
