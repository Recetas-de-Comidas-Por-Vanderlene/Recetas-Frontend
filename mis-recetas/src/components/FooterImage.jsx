// src/components/FooterImage.jsx
import React from 'react';

// NOTA: Para este ejemplo, usaré imágenes de stock de Unsplash,
// pero tú deberías usar las tuyas. Asume que las importaste o usaste URLs.
// Por ahora, solo usaremos el fondo gris oscuro para simular el área.

const FooterImage = () => {
    // Definimos 6 imágenes para simular el banner
    const images = [
        'url(/path/to/img1.jpg)', 
        'url(/path/to/img2.jpg)', 
        'url(/path/to/img3.jpg)', 
        'url(/path/to/img4.jpg)', 
        'url(/path/to/img5.jpg)', 
        'url(/path/to/img6.jpg)', 
    ];

    // La altura del contenedor será fija para replicar el banner
    const bannerHeight = 'h-52 md:h-64'; 
    
    return (
        <div className={`relative w-full overflow-hidden ${bannerHeight}`}>
            {/* Usamos Grid para dividir el espacio en 6 columnas (md:grid-cols-6)
              En móviles, simplemente apilamos las imágenes si fuera necesario, 
              pero para un banner se recomienda mantener la proporción con overflow. 
            */}
            
            <div className="flex w-full h-full">
                {images.map((img, index) => (
                    <div
                        key={index}
                        // La clase 'flex-1' hace que todas ocupen el mismo ancho
                        className={`flex-1 ${bannerHeight} bg-cover bg-center transition-transform duration-500 hover:scale-105`}
                        // En un proyecto real, usarías la etiqueta <img /> o
                        // cargarías una imagen aquí. Usamos un color/URL para simular.
                        style={{
                            backgroundImage: img,
                            backgroundColor: `hsl(${index * 60}, 50%, 40%)` // Simulación de colores si no hay imagen
                        }}
                    />
                ))}
            </div>

            {/* Este es el botón de acción flotante que se ve en tu diseño, si lo deseas */}
            <div className="absolute bottom-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg cursor-pointer">
                <span className="text-xl">⬇️</span> {/* O un ícono de flecha */}
            </div>
        </div>
    );
};

export default FooterImage;