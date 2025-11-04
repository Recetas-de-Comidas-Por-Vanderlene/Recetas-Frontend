// FooterSimpleFood.jsx (Minimalista Extremo - Solo Legal y Copyright)
import React from 'react';

const FooterSimpleFood = () => {
    
    // Lista de enlaces legales y de contacto (ahora son los únicos enlaces)
    const legalAndContactLinks = [
        { title: "Contacto", href: "/contacto" },
        { title: "Privacidad", href: "/privacidad" },
        { title: "Términos", href: "/terminos" },
    ];

    return (
   
        <footer className="bg-gray-900 text-gray-400 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4">
             
                <div className="flex flex-col md:flex-row md:justify-between items-center pb-4 border-b border-gray-800">
                   
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-bold text-orange-500">
                            Vuelta al Mundo
                        </h3>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-end space-x-3 text-xs">
                        {legalAndContactLinks.map((link) => (
                            <a 
                                key={link.title}
                                href={link.href}
                                className="hover:text-orange-400 transition"
                            >
                                {link.title}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-4 text-center text-xs text-gray-600">
                    © {new Date().getFullYear()} Vuelta al Mundo. Todos los derechos reservados.
                </div>
                
            </div>
        </footer>
    );
};

export default FooterSimpleFood;