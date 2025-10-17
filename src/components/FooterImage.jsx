// FooterSimple.jsx
import React from 'react';
// Importa tu imagen (AJUSTA LA RUTA)
import siteLogo from '../assets/logorecetas.png'; 

const Footer = () => {
  
  // Opción 1: Define un nuevo tamaño más grande. h-16 (64px) es el doble de h-8 (32px).
  // Puedes usar h-12, h-16, h-20, etc., hasta h-32 o más, según lo necesites.
  const largeLogoSize = 'h-10 w-auto'; 

  return (
    <footer className="bg-gray-800 text-black p-4 md:p-2">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        
        {/* Columna 1: Copyright y Logo */}
        {/* Utilizamos flex items-center para asegurar que el texto se alinee verticalmente con el logo grande */}
        <div className="mb-4 md:mb-0 flex items-center"> 
          
          <img 
            src={siteLogo} 
            alt="Logo Vuelta al Mundo con Recetas" 
            // 2. APLICAMOS LA CLASE MÁS GRANDE AQUÍ
            className={`${largeLogoSize} mr-6`} 
          />
          
          {/* El margen superior (mt-2) se elimina en móviles (md:mt-0) para alinear */}
          <p className="mt-2 md:mt-0 text-gray-400">
            © {new Date().getFullYear()} Vuelta al Mundo con Recetas. Todos los derechos reservados.
          </p>
        </div>

        {/* Columna 2: Links */}
        <div className="flex space-x-4">
          <a href="/privacidad" className="hover:text-orange-400 transition">Política de Privacidad</a>
          <span className="text-gray-600">|</span>
          <a href="/terminos" className="hover:text-orange-400 transition">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;