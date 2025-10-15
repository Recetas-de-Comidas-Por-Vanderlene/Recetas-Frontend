// src/App.jsx
import React from 'react';
import Hero from './components/Hero';
import NavBar from './components/NavBar';
import SectionIntro from './components/SectionIntro';
import CountryFilter from './components/CountryFilter';
import FooterImage from './components/FooterImage';

function App() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. SECCIÓN SUPERIOR - Hero */}
      <Hero />
      
      {/* 2. BARRA DE NAVEGACIÓN */}
      <NavBar />

      <main>
        {/* 3. SECCIÓN DE INTRODUCCIÓN Y COLUMNAS */}
        <section className="py-12 px-4 md:px-8">
            <SectionIntro />
        </section>

        {/* 4. SECCIÓN DEL FILTRO POR PAÍS (MAPA) */}
        <section className="py-12">
            <CountryFilter />
        </section>

        {/* 5. SECCIÓN FINAL DE IMÁGENES */}
        <FooterImage />

      </main>
    </div>
  )
}

export default App;