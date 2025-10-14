// src/components/CountryFilter.jsx
import React from 'react';
// Si tienes la imagen del mapa, impórtala aquí:
// import worldMap from '../assets/world-map.png';

const CountryFilter = () => {
  const countries = ['Brasil', 'España', 'México', 'Italia', 'Japón', 'India'];

  return (
    <div className="relative pt-12 pb-24 px-4 bg-orange-50/50"> {/* Fondo ligeramente beige/naranja claro */}
      
      {/* Título de la Sección */}
      <h2 className="text-3xl font-bold text-center mb-8">
        Explora Sabores por País
      </h2>

      {/* Contenedor principal de filtros y mapa */}
      <div className="relative max-w-7xl mx-auto">
        
        {/* Mapa como imagen de fondo (o SVG) */}
        {/* Aquí usaremos un div simple con un alto para simular el área del mapa. 
            Si usas una imagen, la pones con 'absolute' e 'inset-0'. */}
        <div 
          className="relative h-[400px] w-full bg-cover bg-center opacity-40"
          style={{ 
            // Si tuvieras una imagen de mapa: backgroundImage: `url(${worldMap})`,
            backgroundColor: '#F5EFE3' // Color beige claro para simular el mapa
          }}
        >
            {/* Si usas una imagen, ponla aquí */}
        </div>

        {/* Capa de filtros sobre el mapa */}
        <div className="absolute inset-0 flex flex-col justify-start items-center p-8">
          
          {/* Título "Filtrar Recetas por País" */}
          <p className="text-xl font-semibold mb-6 self-start md:self-center">
            Filtrar Recetas por País
          </p>

          {/* Botones de Filtro */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {countries.map(country => (
              <button
                key={country}
                className="px-6 py-2 rounded-full border border-gray-400 
                           text-gray-700 hover:bg-orange-300 hover:text-white 
                           transition duration-200 shadow-md bg-white"
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
                           rounded-full text-lg shadow-xl hover:bg-orange-600 
                           transition duration-300">
          Empieza a Explorar!
        </button>
      </div>
    </div>
  );
};

export default CountryFilter;