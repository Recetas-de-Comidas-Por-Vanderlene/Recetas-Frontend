// src/components/Hero.jsx
import React from 'react';
import HeroBg from '../assets/hero-bg.png'; // Verifica que la ruta sea correcta

const Hero = () => {
  return (
    // Usamos 'relative' para que el icono 'absolute' se posicione dentro del header
    <header
      className="relative w-full h-[30vh] md:h-[50vh] lg:h-[60vh] bg-center bg-cover bg-no-repeat brightness-100"
      style={{ backgroundImage: `url(${HeroBg})` }}
    >
      {/* Ícono de Usuario (Login) en la esquina superior derecha */}
      {/* Usamos z-10 para asegurar que esté sobre la imagen si fuera necesario */}
      <div className="absolute top-4 right-6 z-10 cursor-pointer">
        <svg 
          // Ajustamos el tamaño a w-5 h-5 para que sea visible pero discreto
          className="w-6 h-6 text-white hover:text-orange-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Path para el icono de usuario/login */}
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
          />
        </svg>
      </div>
      
    </header>
  );
};

export default Hero;
