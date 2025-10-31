// src/services/recipe.js

const API_URL = 'http://localhost:8080/api/recetas'; // Asume la ruta de tu API

export async function createRecipe(dataToSend) {
    try {
        // IMPORTANTE: NO se establece el 'Content-Type': 'application/json' 
        // cuando se usa FormData, el navegador lo configura automáticamente.
        
        const response = await fetch(API_URL, {
            method: 'POST',
            body: dataToSend, // dataToSend es el objeto FormData que incluye la foto
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar la receta.');
        }

        return data; // Devuelve la receta creada o un mensaje de éxito
    } catch (error) {
        console.error("Error en createRecipe:", error);
        throw error;
    }
}

// Opcional: Función para obtener los países de la base de datos
export async function fetchCountries() {
     try {
        const response = await fetch(`${API_URL}/countries`);
        if (!response.ok) {
            throw new Error('Error al cargar la lista de países.');
        }
        return await response.json();
    } catch (error) {
        console.error("Error en fetchCountries:", error);
        return []; // Devuelve un array vacío en caso de error
    }
}