// src/components/SectionIntro.jsx
import React from 'react';

const SectionIntro = () => {
  return (
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-2">Hola, ¡Bienvenido!</h2>
      <p className="text-gray-600 mb-10">¿Qué quieres cocinar hoy?</p>
      
      {/* Tres columnas con Flexbox o Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {/* Columna Colabora */}
        <div>
          <h3 className="font-bold text-lg mb-2">Colabora</h3>
          <p className="text-sm text-gray-700">No te guardes tus secretos. Añade tus propias recetas de forma sencilla y comparte tu talento con una comunidad en tiempo real.</p>
        </div>
        
        {/* Columna Explora */}
        <div>
          <h3 className="font-bold text-lg mb-2">Explora</h3>
          <p className="text-sm text-gray-700">Navega al instante por país, descubriendo desde los Tacos al Pastor más auténticos hasta la Pasta Carbonara más original y guarda tus favoritos.</p>
        </div>
        
        {/* Columna Organiza */}
        <div>
          <h3 className="font-bold text-lg mb-2">Organiza</h3>
          <p className="text-sm text-gray-700">Navega por tus Favoritos y el Catálogo y arrastra y suelta recetas en días específicos para planificar tu menú semanal sin estrés.</p>
        </div>
      </div>
    </div>
  );
};

export default SectionIntro;