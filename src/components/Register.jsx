// src/components/Register.jsx (Código FINAL y COMPLETO con el campo 'foto')

import React, { useState } from 'react';

// URL base de tu backend Spring Boot
const API_BASE_URL = 'http://localhost:8080';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/; 

// 🚨 URL por defecto si el usuario no proporciona una foto 🚨
const DEFAULT_PHOTO_URL = 'https://i.ibb.co/60qB2dM/default-user-avatar.png'; 

const Register = ({ onSignupSuccess, onNavigateToLogin }) => {
    // 1. Estado: Añadimos 'foto'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        foto: '', // <-- Nuevo campo para la URL de la foto
    });
    
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Función para manejar cambios en los inputs (Sin cambios)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
        setMessage('');
    };

    // Validación (Actualizada para no requerir 'foto' si se usa una por defecto)
    const validate = () => {
        let currentErrors = {};
        
        if (!formData.name) currentErrors.name = 'El nombre es obligatorio.';
        
        if (!formData.email) {
            currentErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            currentErrors.email = 'El correo electrónico no es válido.';
        }
        
        if (!formData.password) {
            currentErrors.password = 'La contraseña es obligatoria.';
        } else if (!PASSWORD_REGEX.test(formData.password)) {
            currentErrors.password = '8+ caracteres, Mayúscula, Número.';
        }

        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    };

    // Función para manejar el envío real al Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validate()) {
            setMessage('🚨 Corrige los errores.');
            return;
        }

        setIsSubmitting(true);
        
        // 🚨 CRÍTICO: Construir el objeto de datos con los 4 campos esperados 🚨
        const dataToSend = {
            nombre: formData.name, // Coincide con tu DTO
            email: formData.email,
            password: formData.password,
            // Si el campo está vacío, enviamos la URL por defecto, sino, la URL ingresada
            foto: formData.foto || DEFAULT_PHOTO_URL, 
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
            
            const result = await response.json().catch(() => ({})); 

            if (response.ok) {
                setMessage('✅ Registro exitoso.');
                setFormData({ name: '', email: '', password: '', foto: '' }); 
                if (onSignupSuccess) onSignupSuccess(); 
            } else if (response.status === 400 || response.status === 409) {
                const errorMessage = result.message || 'Error: El correo o nombre ya están en uso.';
                setMessage(`❌ ${errorMessage}`);
                if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('correo')) {
                    setErrors(prevErrors => ({ ...prevErrors, email: 'Correo ya registrado.' }));
                }
            } else {
                setMessage(`❌ Error ${response.status}: Inténtalo más tarde.`);
            }

        } catch (error) {
            console.error('Error de registro:', error);
            setMessage('❌ Error de conexión con el servidor. Verifica que tu backend esté activo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="dark:text-gray-100"> 
            <h3 className="text-lg font-semibold mb-1 text-center text-gray-900 dark:text-gray-100">Crear Cuenta</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">

                {message && (
                    <div className={`p-1 rounded text-center text-xs font-medium ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                
                {/* Campo Nombre */}
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre completo"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full p-1.5 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-sm focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400`}
                        disabled={isSubmitting}
                    />
                    {errors.name && <p className="mt-0 text-xs text-red-500">{errors.name}</p>}
                </div>
                
                {/* Campo Correo Electrónico */}
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo Electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full p-1.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-sm focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400`}
                        disabled={isSubmitting}
                    />
                    {errors.email && <p className="mt-0 text-xs text-red-500">{errors.email}</p>}
                </div>
                {/* Campo Contraseña */}
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full p-1.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-sm focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400`}
                        disabled={isSubmitting}
                    />
                    {errors.password && <p className="mt-0 text-xs text-red-500">{errors.password}</p>}
                    {/* HINTS MÁS PEQUEÑOS */}
                    <p className="mt-0 text-xs text-gray-500 dark:text-gray-400">8+ caracteres, Mayúscula, Número.</p>
                </div>
                
                {/* Botón de Registro COMPACTO */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-1.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition duration-150 mt-2"
                >
                    {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
                </button>

                {/* Enlace para volver al Login COMPACTO */}
                <div className="mt-1 text-center">
                    <button
                        type="button"
                        onClick={onNavigateToLogin}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                    >
                        ¿Ya tienes cuenta? Inicia Sesión
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;