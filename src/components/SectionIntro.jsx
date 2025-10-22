// src/components/SectionIntro.jsx (ACTUALIZADO CON ICONOS MINIMALISTAS)

import React from 'react';

const SectionIntro = ({ username }) => {
    return (
        <div className="max-w-6xl mx-auto text-center">
            
            {/* Título principal: Icono simple o eliminado */}
            <h2 className="text-4xl font-bold mb-4 text-gray-500 dark:text-gray-100">
                {/* 💡 Ícono de asterisco o punto para un toque sutil, o se deja sin ícono */}
                • ¡Hola! {username ? username : 'Bienvenido'}
            </h2>
            <p className="text-lg font-light text-gray-600 dark:text-gray-400 mb-10">
                Encuentra, comparte y planifica tu próxima obra maestra culinaria.
            </p>
            
            {/* Contenedor Grid para las Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                
                {/* 1. Tarjeta Colabora - Icono minimalista */}
                <div className="p-5 rounded-2xl shadow-xl transition duration-300 transform hover:shadow-2xl hover:scale-[1.03]
                                bg-white dark:bg-gray-800 border-t-4 border-orange-500 dark:border-orange-400">
                    
                    {/* 💡 Ícono de flecha o punto simple */}
                    <h3 className="font-extrabold text-lg mb-2 text-orange-600 dark:text-orange-400">
                        → Colabora
                    </h3>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        No te guardes tus secretos. Añade tus propias recetas de forma sencilla y comparte tu talento con una comunidad en tiempo real.
                    </p>
                </div>
                
                {/* 2. Tarjeta Explora - Icono minimalista */}
                <div className="p-5 rounded-2xl shadow-xl transition duration-300 transform hover:shadow-2xl hover:scale-[1.03] 
                                bg-white dark:bg-gray-800 border-t-4 border-red-600 dark:border-red-500">
                    
                    {/* 💡 Ícono de diamante o punto simple */}
                    <h3 className="font-extrabold text-lg mb-2 text-red-700 dark:text-red-500">
                        ◇ Explora Sabores
                    </h3>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Navega al instante por país, descubriendo desde los Tacos al Pastor más auténticos hasta la Pasta Carbonara más original y guarda tus favoritos.
                    </p>
                </div>
                
                {/* 3. Tarjeta Organiza - Icono minimalista */}
                <div className="p-5 rounded-2xl shadow-xl transition duration-300 transform hover:shadow-2xl hover:scale-[1.03] 
                                bg-white dark:bg-gray-800 border-t-4 border-lime-600 dark:border-lime-500">
                    
                    {/* 💡 Ícono de guion o punto simple */}
                    <h3 className="font-extrabold text-lg mb-2 text-lime-700 dark:text-lime-500">
                        - Planifica y Organiza
                    </h3>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Navega por tus Favoritos y el Catálogo para planificar tu menú semanal sin estrés. ¡La cocina nunca fue tan fácil!
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default SectionIntro;