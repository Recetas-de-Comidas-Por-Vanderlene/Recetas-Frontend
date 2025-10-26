import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

// Recibe las props necesarias para la navegación
const NavBar = ({ isLoggedIn, onNavigateHome, onNavigateRecipeForm, onNavigateAllRecipes }) => {
  // Se añadió 'cursor-pointer' para mejor UX
  const linkClasses = "text-white hover:text-gray-200 transition duration-300 px-2 py-1 cursor-pointer"; 
  const socialIconClasses = "text-black hover:text-gray-200 transition duration-300 text-lg";

  const socialLinks = [
    { icon: <FaInstagram />, url: "https://instagram.com" },
    { icon: <FaFacebookF />, url: "https://facebook.com" },
    { icon: <FaTwitter />, url: "https://twitter.com" },
  ];

  return (
    <nav className="bg-orange-400 text-white p-4 shadow-xl flex justify-between items-center">
      {/* Links de navegación */}
      <div className="flex space-x-6 font-semibold text-lg">
        {/* Usamos onClick para cambiar la vista principal en App.js */}
        <div onClick={onNavigateHome} className={linkClasses}>Home</div>
        
        {/* Enlace de Recetas ahora usa la función de navegación */}
        <div onClick={onNavigateAllRecipes} className={linkClasses}>Recetas</div> 
        
        <div className={linkClasses}>Contactos</div>
      </div>

      {/* Íconos sociales */}
      <div className="flex space-x-4">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={socialIconClasses}
          >
            {social.icon}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;