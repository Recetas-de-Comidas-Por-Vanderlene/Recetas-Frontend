// Register.jsx (Código FINAL Minimalista y Compacto)

import React, { useState } from 'react';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/; 

const Register = ({ onSignupSuccess, onNavigateToLogin }) => {
    // 1. Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Función para manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
        setMessage('');
    };

    // Función principal de validación
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

    // Función para manejar el envío (simulación)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validate()) {
            setMessage('🚨 Corrige los errores.');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // --- SIMULACIÓN DE LLAMADA AL BACKEND ---
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            if (formData.email === 'registrado@ejemplo.com') {
                 setMessage('❌ Este correo ya está en uso.');
                 setErrors(prevErrors => ({ ...prevErrors, email: 'Correo ya registrado.' }));
            } else {
                 // ÉXITO
                 setFormData({ name: '', email: '', password: '' }); 
                 if (onSignupSuccess) onSignupSuccess(); 
            }

        } catch (error) {
            setMessage('❌ Error de conexión. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // ELIMINAMOS ESTILOS DE TAMAÑO Y PADDING DEL CONTENEDOR EXTERNO
        <div className="dark:text-gray-100"> 
            
            {/* TÍTULO MÁS PEQUEÑO: text-lg y mb-1 */}
            <h3 className="text-lg font-semibold mb-1 text-center text-gray-900 dark:text-gray-100">Crear Cuenta</h3>
            
            {/* REDUCIMOS EL ESPACIO ENTRE ELEMENTOS A gap-1 */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">

                {/* Mensajes de feedback compactos */}
                {message && (
                    <div className={`p-1 rounded text-center text-xs font-medium ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                
                {/* Campo Nombre (INPUT COMPACTO) */}
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
                
                {/* Campo Correo Electrónico (INPUT COMPACTO) */}
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
                
                {/* Campo Contraseña (INPUT COMPACTO) */}
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