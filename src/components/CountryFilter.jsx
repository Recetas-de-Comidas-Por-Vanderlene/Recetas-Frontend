// src/components/CountryFilter.jsx
import React from 'react';
// ¡Asegúrate de que esta ruta sea correcta y el archivo exista!
import MapBg from '../assets/mapacontinentes.jpg'; 

const CountryFilter = () => {
  const countries = ['Brasil', 'España', 'México', 'Italia', 'Japón', 'India'];

  // Definición del estilo para el fondo del mapa
  const mapBgStyle = {
    backgroundImage: `url(${MapBg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain', // Ajusta el mapa dentro del contenedor
    backgroundPosition: 'center',
  };

  return (
    <div className="relative pt-12 pb-24 px-4 bg-orange-50/50"> 
      
      {/* Título de la Sección: Más grande y moderno */}
      <h2 className="text-5xl font-extrabold text-center mb-10 text-gray-800">
        Explora Sabores por País
      </h2>

      {/* Contenedor principal de filtros y mapa */}
      <div className="relative max-w-7xl mx-auto">
        
        {/* CAPA DEL MAPA como fondo */}
        <div 
          // Ajustamos la altura y aplicamos el estilo inline del mapa
          className="relative h-[550px] w-full opacity-60" 
          style={mapBgStyle}
        >
          {/* Aquí puedes añadir otros elementos de diseño del mapa si es necesario */}
        </div>

        {/* CAPA DE FILTROS Y CONTENIDO (Posicionada ABSOLUTE sobre el mapa) */}
        <div className="absolute inset-0 flex flex-col justify-start items-center p-8">
          
          {/* Título "Filtrar Recetas por País" */}
          <p className="text-xl text-center font-semibold mb-6 text-gray-700 self-start md:self-center">
            Filtrar Recetas por País
          </p>

          {/* Botones de Filtro - Ajustados para ser más visibles */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {countries.map(country => (
              <button
                key={country}
                className="px-6 py-2 rounded-full border border-orange-500 
                           text-orange-500 hover:bg-orange-500 hover:text-white 
                           transition duration-200 shadow-lg bg-white font-semibold"
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