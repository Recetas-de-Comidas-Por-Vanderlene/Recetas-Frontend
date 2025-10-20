// FooterSimpleFood.jsx
import React from 'react';

const FooterSimpleFood = () => {
    
    const mainLinks = [
        { title: "Recetas Populares", href: "/recetas-populares" },
        { title: "Ingredientes", href: "/ingredientes" },
        { title: "Contacto", href: "/contacto" },
        { title: "Blog", href: "/blog" },
    ];
    
    const legalLinks = [
        { title: "Política de Privacidad", href: "/privacidad" },
        { title: "Términos de Uso", href: "/terminos" },
    ];

    return (
        // 1. AJUSTE: Reducimos el relleno vertical de py-10 md:py-12 a py-8 md:py-10
        <footer className="bg-gray-900 text-gray-400 py-4 md:py-10">
            {/* 2. AJUSTE: Reducimos el ancho máximo de max-w-7xl a max-w-6xl */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4">
                
                {/* GRID Principal para la distribución de contenido */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-6 border-b border-gray-700">
                    
                    {/* Columna 1: Logo/Título y Contacto */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-xl font-bold text-orange-500 mb-2"> {/* Reducimos el tamaño del título */}
                            Vuelta al Mundo
                        </h3>
                        <p className="text-sm mb-3">
                            Descubre los sabores auténticos de cada rincón del planeta con nuestras recetas.
                        </p>
                        <h4 className="font-bold text-white mb-1 text-sm">Contacto Directo:</h4> {/* Reducimos el tamaño del subtítulo */}
                        <p className="text-xs">
                            <a href="mailto:info@recetas.com" className="hover:text-orange-400 transition">info@recetas.com</a>
                        </p>
                    </div>

                    {/* Columna 2: Navegación Rápida */}
                    <div>
                        <h4 className="font-bold text-white mb-3 text-sm">Explorar</h4> {/* Reducimos el tamaño del subtítulo */}
                        <ul className="space-y-1"> {/* Reducimos el espacio entre elementos */}
                            {mainLinks.map((link) => (
                                <li key={link.title}>
                                    <a 
                                        href={link.href}
                                        className="hover:text-orange-400 transition text-xs" // Reducimos el tamaño del texto
                                    >
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 3: Información Legal */}
                    <div>
                        <h4 className="font-bold text-white mb-3 text-sm">Legal</h4>
                        <ul className="space-y-1">
                            {legalLinks.map((link) => (
                                <li key={link.title}>
                                    <a 
                                        href={link.href}
                                        className="hover:text-orange-400 transition text-xs"
                                    >
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sección de Copyright Final */}
                <div className="mt-6 pt-3 text-center text-xs text-gray-600 border-t border-gray-800"> {/* Reducimos margen y padding */}
                    © {new Date().getFullYear()} Vuelta al Mundo con Recetas. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
};

export default FooterSimpleFood;