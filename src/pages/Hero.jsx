// src/components/Hero.jsx
import React, { useState, useRef, useEffect } from 'react';
import HeroBg from '../assets/Vuelta.png';
import { FaMoon, FaSun } from 'react-icons/fa';

const Hero = ({ onUserClick, isLoggedIn, onLogout, theme, toggleTheme }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative w-full overflow-hidden rounded-b-2xl">
      {/* Imagen de fondo responsive */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:h-[70vh] lg:h-[80vh]">
        <img
          src={HeroBg}
          alt="Fondo principal"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Capa oscura + texto centrado */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
        
        </div>
      </div>

      {/* Iconos superiores */}
      <div
        className="absolute top-3 right-4 z-10 flex flex-col gap-2 items-end"
        ref={menuRef}
      >
        {/* Icono usuario */}
        <div
          className="cursor-pointer"
          onClick={() => {
            if (isLoggedIn) {
              setShowMenu((prev) => !prev);
            } else if (onUserClick) {
              onUserClick();
            }
          }}
          title={isLoggedIn ? "Opciones de usuario" : "Iniciar sesión"}
        >
          <svg
            className={`w-6 h-6 ${
              isLoggedIn
                ? 'text-green-400'
                : 'text-white hover:text-orange-400 transition-colors'
            }`}
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

        {/* Menú logout */}
        {isLoggedIn && showMenu && (
          <div className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded shadow-lg">
            <button
              className="block w-full text-center px-4 py-1 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs"
              onClick={() => {
                setShowMenu(false);
                if (onLogout) onLogout();
              }}
            >
              Logout
            </button>
          </div>
        )}

        {/* Botón tema */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-md backdrop-blur-md transition-colors"
          aria-label="Toggle theme"
          title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        >
          {theme === 'light' ? (
            <FaMoon className="w-3 h-3" />
          ) : (
            <FaSun className="w-3 h-3" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Hero;
