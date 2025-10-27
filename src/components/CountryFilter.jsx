// src/components/CountryFilter.jsx (Código Final con Opacidad y Filtros Dark Mode)

import React from 'react';
// ¡Asegúrate de que esta ruta sea correcta y el archivo exista!
import MapBg from '../assets/mapacontinentes.jpg'; 

const CountryFilter = () => {
    const countries = ['Brasil', 'España', 'México', 'Italia', 'Japón', 'India'];

    const mapBgStyle = {
        backgroundImage: `url(${MapBg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain', 
        backgroundPosition: 'center',
    };
    const cargarRecetas = async (pais) => {
    try {
        const res = await fetch(`http://localhost:5173/api/recetas/pais?nombrePais=${pais}`);
        const data = await res.json();
        setRecetas(data);
    } catch (err) {
        console.error('Error cargando recetas:', err);
    }
};
    return (
        // Contenedor principal: color de fondo cambia con el tema
        <div className="relative pt-12 pb-24 px-4 bg-white dark:bg-gray-900"> 
            
            {/* Título de la Sección */}
            <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800 dark:text-gray-100">
                Explora Sabores por País
            </h2>

            {/* Título de Filtros (fuera del mapa) */}
            <div className="max-w-7xl mx-auto px-4">
                <p className="text-2xl text-center font-bold mb-6 text-gray-700 dark:text-gray-300">
                    Filtrar Recetas por País
                </p>
            </div>
            
            
            {/* Contenedor del Mapa y los Filtros */}
            <div className="relative max-w-7xl mx-auto">
                
                {/* CAPA DEL MAPA como fondo con FILTROS DARK MODE */}
                <div className="relative h-[550px] w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden"> 
                    
                    <div
                        // APLICACIÓN DE FILTROS:
                        // 1. Opacidad: 60% en Claro, 10% en Oscuro.
                        // 2. Filtros: Aplica grayscale e inversión de color SOLO en Dark Mode 
                        //             para que el mapa se vea blanco sobre fondo oscuro.
                        className="absolute inset-0 h-full w-full opacity-60 dark:opacity-10 dark:filter dark:grayscale dark:invert" 
                        style={mapBgStyle}
                    >
                    </div>

                </div>

                {/* *** CAPA DE FILTROS Y BOTONES (sobre el mapa) *** *** CAMBIO CLAVE: justify-start y pt-16 para mover el contenido arriba. ***
                */}
                <div className="absolute inset-0 flex flex-col **justify-start** items-center **pt-16**">
                    
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {countries.map(country => (
                            <button
                                key={country}
                                // Estilos de botón para Dark/Light Mode
                                className="px-6 py-2 rounded-full border border-orange-500 
                                            text-orange-500 hover:bg-orange-500 hover:text-white 
                                            transition duration-200 shadow-xl bg-white dark:bg-gray-700 dark:text-orange-400 
                                            dark:hover:bg-orange-500 dark:hover:text-white font-semibold"
                            >
                                {country}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Botón de Exploración Final */}
            <div className="text-center mt-16">
                <button className="bg-orange-500 text-white font-bold py-3 px-8 
                                    rounded-full text-lg shadow-2xl hover:bg-orange-600 
                                    transition duration-300 transform hover:scale-105">
                    Empieza a Explorar!
                </button>
            </div>
        </div>
    );
};

export default CountryFilter;