const API_URL = 'http://localhost:8080/api/recetas'; 

export async function createRecipe(dataToSend) {
    try {
     
        const response = await fetch(API_URL, {
            method: 'POST',
            body: dataToSend,
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar la receta.');
        }

        return data; 
    } catch (error) {
        console.error("Error en createRecipe:", error);
        throw error;
    }
}

export async function fetchCountries() {
     try {
        const response = await fetch(`${API_URL}/countries`);
        if (!response.ok) {
            throw new Error('Error al cargar la lista de países.');
        }
        return await response.json();
    } catch (error) {
        console.error("Error en fetchCountries:", error);
        return []; 
    }
}