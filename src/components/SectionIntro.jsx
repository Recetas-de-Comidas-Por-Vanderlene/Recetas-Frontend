// src/components/SectionIntro.jsx
import React from "react";

const SectionIntro = () => {
  return (
    <section className="max-w-6xl mx-auto text-center py-12 px-4">
      <h2 className="text-3xl font-bold mb-2">Hola, ¡Bienvenido!</h2>
      <p className="text-gray-600 mb-10 text-lg">
        ¿Qué quieres cocinar hoy?
      </p>

      {/* Contenedor de las tres cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Colabora */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 text-left">
          <h3 className="text-xl font-semibold mb-3 text-orange-600">Colabora</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            No te guardes tus secretos. Añade tus propias recetas de forma sencilla
            y comparte tu talento con una comunidad en tiempo real.
          </p>
        </div>

        {/* Card 2: Explora */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 text-left">
          <h3 className="text-xl font-semibold mb-3 text-green-600">Explora</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Navega al instante por país, descubriendo desde los Tacos al Pastor más
            auténticos hasta la Pasta Carbonara más original y guarda tus favoritos.
          </p>
        </div>

        {/* Card 3: Organiza */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 text-left">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">Organiza</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Navega por tus Favoritos y el Catálogo y arrastra y suelta recetas en
            días específicos para planificar tu menú semanal sin estrés.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SectionIntro;
