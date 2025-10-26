import React, { useState, useEffect } from 'react';

// URL base de tu backend (¡AJUSTA ESTA URL!)
const API_BASE_URL = 'http://localhost:5000'; // Ejemplo: Cambia el puerto si es necesario

// Función auxiliar para gestionar los favoritos en localStorage
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

// Componente principal de la página de recetas
const AllRecipes = ({ isLoggedIn }) => {
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Nuevo estado para manejar errores

    // 1. Cargar recetas y favoritos al inicio
    useEffect(() => {
        // Cargar favoritos desde localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites.map(String)); 
        
        // Función para cargar recetas desde el backend
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/recipes`);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                
                // ASUME que 'data' es un array de objetos de recetas.
                // AJUSTA esta línea si tu API retorna el array dentro de un objeto.
                setRecipes(data); 
                
            } catch (err) {
                console.error("Error al obtener las recetas:", err);
                setError("No se pudieron cargar las recetas. Inténtalo de nuevo más tarde.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchRecipes();
    }, []);

    // 2. Manejar el click en el botón de favorito
    const handleFavoriteClick = (recipeId) => {
        if (!isLoggedIn) {
            alert("🔒 Debes iniciar sesión para guardar favoritos.");
            return;
        }
        
        // NOTA: Para un sistema robusto, DEBERÍAS enviar también esta acción
        // a tu backend para guardar el favorito en la base de datos del usuario.
        
        // Actualiza el localStorage y el estado de React (para renderizado inmediato)
        const newFavorites = toggleFavorite(recipeId);
        setFavorites(newFavorites.map(String));
    };

    if (isLoading) {
        return <div className="text-center p-12 text-xl dark:text-gray-300">Cargando recetas...</div>;
    }
    
    if (error) {
        return <div className="text-center p-12 text-xl text-red-500">{error}</div>;
    }

    // 3. Renderizado
    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-orange-600 dark:text-orange-400">Todas las Recetas del Mundo 🌎</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.length > 0 ? (
                    recipes.map(recipe => {
                        // Asegúrate de que tu API devuelva un campo 'id'
                        const recipeIdStr = String(recipe.id);
                        const isFavorite = favorites.includes(recipeIdStr);
                        
                        return (
                            <div 
                                key={recipe.id} 
                                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{recipe.title || 'Receta sin título'}</h2>
                                    {/* AJUSTA los campos (country, author) a los que te dé tu API */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">De: {recipe.country || 'N/A'} | Autor: {recipe.author || 'Anónimo'}</p>
                                </div>

                                {/* Botón de Favorito */}
                                <button
                                    onClick={() => handleFavoriteClick(recipe.id)}
                                    className={`self-start mt-4 flex items-center space-x-2 px-4 py-2 rounded-full transition duration-300 text-sm font-medium
                                        ${isFavorite 
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                        }`
                                    }
                                >
                                    {/* Ícono de Corazón */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    <span>{isFavorite ? 'En Favoritos' : 'Añadir a Favoritos'}</span>
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-lg col-span-full dark:text-gray-300">No hay recetas disponibles en este momento.</p>
                )}
            </div>
        </div>
    );
};

export default AllRecipes;