// src/components/Hero.jsx (Hero más grande)

import React, { useState, useRef, useEffect } from 'react';
import HeroBg from '../assets/hero-bg.png';
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
        <header
            className="relative w-full h-[85vh] md:h-[70vh] lg:h-[80vh] bg-center bg-cover bg-no-repeat brightness-100"
            style={{ backgroundImage: `url(${HeroBg})` }}
        >
            <div
                className="absolute top-4 right-6 z-10"
                ref={menuRef}
            >
                {/* 1. ICONO DE USUARIO/LOGIN */}
                <div className="cursor-pointer mb-2"
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


                {isLoggedIn && showMenu && (
                    <div className="absolute right-0 mt-2 w-20 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded shadow-lg">
                        <button
                            className="block w-full text-center px-4 py-0.5 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs"
                            onClick={() => {
                                setShowMenu(false);
                                if (onLogout) onLogout();
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}


                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full 
                              bg-white dark:bg-gray-700 
                              text-gray-700 dark:text-gray-200 
                              shadow-md transition-colors"
                    aria-label="Toggle theme"
                    title={theme === 'light' ? 'Activar Modo Oscuro' : 'Activar Modo Claro'}
                >

                    {theme === 'light' ? (
                        <FaMoon className="w-2 h-2" />
                    ) : (
                        <FaSun className="w-2 h-2" />
                    )}
                </button>
            </div>
        </header>
    );
};

export default Hero;