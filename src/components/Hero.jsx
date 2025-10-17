import React from 'react';
import HeroBg from '../assets/hero-bg.png';


const Hero = ({ onUserClick, isLoggedIn }) => {
  return (
    // Usamos 'relative' para que el icono 'absolute' se posicione dentro del header
    <header
      className="relative w-full h-[30vh] md:h-[50vh] lg:h-[60vh] bg-center bg-cover bg-no-repeat brightness-100"
      style={{ backgroundImage: `url(${HeroBg})` }}
    >
      {/* Ícono de Usuario (Login) en la esquina superior derecha */}
      <div 
        className="absolute top-4 right-6 z-10 cursor-pointer"
        onClick={() => {
          if (!isLoggedIn && onUserClick) onUserClick();
        }}
        title={isLoggedIn ? "Ya has iniciado sesión" : "Iniciar sesión"}
      >
        <svg 
          className={`w-6 h-6 ${isLoggedIn ? 'text-green-400' : 'text-white hover:text-orange-400'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
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
