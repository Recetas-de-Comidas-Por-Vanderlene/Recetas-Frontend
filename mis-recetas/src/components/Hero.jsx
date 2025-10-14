// src/components/Hero.jsx
import React from 'react';
import HeroBg from '../assets/hero-bg.png'; // Verifica que la ruta sea correcta

const Hero = () => {
  return (
    <header
      className="relative w-full h-[30vh] md:h-[50vh] lg:h-[60vh] bg-center bg-cover bg-no-repeat brightness-100"
      style={{ backgroundImage: `url(${HeroBg})` }}
    >
      {/* Sin overlay para máxima luminosidad */}
    </header>
  );
};

export default Hero;
