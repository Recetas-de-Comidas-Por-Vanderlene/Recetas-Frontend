import React from 'react';
import MapBg from '../assets/mapacontinentes.jpg';

const CountryFilter = () => {
    const countries = ['Brasil', 'España', 'México', 'Italia', 'Japón', 'India'];

    const mapBgStyle = {
        backgroundImage: `url(${MapBg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
    };
    const cargarRecetas = async (pais) => {
        try {
            const res = await fetch(`http://localhost:5173/api/recetas/pais?nombrePais=${pais}`);
            const data = await res.json();
            setRecetas(data);
        } catch (err) {
            console.error('Error cargando recetas:', err);
        }
    };
    return (

        <div className="relative pt-12 pb-24 px-4 bg-white dark:bg-gray-900">
            <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800 dark:text-gray-100">
                Explora Sabores por País
            </h2>

            <div className="max-w-7xl mx-auto px-4">
                <p className="text-2xl text-center font-bold mb-6 text-gray-700 dark:text-gray-300">
                    Filtrar Recetas por País
                </p>
            </div>
            <div className="relative max-w-7xl mx-auto">
                <div className="relative h-[550px] w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden">

                    <div
                        className="absolute inset-0 h-full w-full opacity-60 dark:opacity-10 dark:filter dark:grayscale dark:invert"
                        style={mapBgStyle}
                    >
                    </div>
                </div>
                <div className="absolute inset-0 flex flex-col **justify-start** items-center **pt-16**">

                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {countries.map(country => (
                            <button
                                key={country}

                                className="px-6 py-2 rounded-full border border-orange-500 
                                            text-orange-500 hover:bg-orange-500 hover:text-white 
                                            transition duration-200 shadow-xl bg-white dark:bg-gray-700 dark:text-orange-400 
                                            dark:hover:bg-orange-500 dark:hover:text-white font-semibold"
                            >
                                {country}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
            <div className="text-center mt-16">
                <button className="bg-orange-500 text-white font-bold py-3 px-8 
                                    rounded-full text-lg shadow-2xl hover:bg-orange-600 
                                    transition duration-300 transform hover:scale-105">
                    Empieza a Explorar!
                </button>
            </div>
        </div>
    );
};
export default CountryFilter;