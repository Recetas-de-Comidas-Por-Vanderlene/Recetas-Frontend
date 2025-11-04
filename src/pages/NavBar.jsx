import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const NavBar = ({ isLoggedIn }) => {
  const linkClasses = "text-white hover:text-gray-200 transition duration-300 px-2 py-1 cursor-pointer"; 
  const socialIconClasses = "text-black hover:text-gray-200 transition duration-300 text-lg";

  const socialLinks = [
    { icon: <FaInstagram />, url: "https://instagram.com" },
    { icon: <FaFacebookF />, url: "https://facebook.com" },
    { icon: <FaTwitter />, url: "https://twitter.com" },
  ];

  return (
    <nav className="bg-orange-400 text-white p-4 shadow-xl flex justify-between items-center">
      <div className="flex space-x-6 font-semibold text-lg">
        <Link to="/" className={linkClasses}>
          Home
        </Link>
        
        <Link to="/recetas" className={linkClasses}>
          Recetas
        </Link>
        
        <Link to="/contactos" className={linkClasses}>
          Contactos
        </Link>
      </div>

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