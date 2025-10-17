import React, { useState } from 'react';
import Hero from './components/Hero';
import NavBar from './components/NavBar';
import SectionIntro from './components/SectionIntro';
import CountryFilter from './components/CountryFilter';
import FooterImage from './components/FooterImage';
import Login from './components/Login';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (data) => {
    console.log("Usuario logueado:", data);
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero con icono de usuario */}
      <Hero onUserClick={() => setShowLogin(true)} isLoggedIn={isLoggedIn} />

      {/* NavBar */}
      <NavBar />

      <main>
        {/* Secciones */}
        <section className="py-12 px-4 md:px-8">
          <SectionIntro />
        </section>

        <section className="py-12">
          <CountryFilter />
        </section>

        <FooterImage />
      </main>

      {/* Modal de Login */}
      {showLogin && !isLoggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowLogin(false)}
            >
              ✖
            </button>
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
