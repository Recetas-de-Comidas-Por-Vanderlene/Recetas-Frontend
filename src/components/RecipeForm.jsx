// src/components/RecipeForm.jsx (Diseño de Página Completa)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

// Datos de países simulados
const DUMMY_COUNTRIES = [
    { id: '3', nombre: 'Brasil' },
    { id: '4', nombre: 'México' },
    { id: '5', nombre: 'España' },
    { id: '6', nombre: 'Italia' },
    { id: '7', nombre: 'Japón' },
    { id: '8', nombre: 'India' },
];

export default function RecipeForm({ onRecipeSuccess }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        paisId: '',
        fotoUrl: '',
        duracionMinutos: 30,
        dificultad: 'Media'
    });
    const [ingredientes, setIngredientes] = useState([{
        nombre: '',
        cantidad: '',
        unidad: '',
        descripcion: ''
    }]);
    const [pasos, setPasos] = useState([{
        descripcion: '',
        orden: 1,
        fotoUrl: ''
    }]);
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // 💡 EFECTO: Simulación de carga de países (Frontend)
    useEffect(() => {
        setCountries(DUMMY_COUNTRIES);
    }, []);

    // --- Funciones de Manejo de Inputs (se mantienen igual) ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setError('');
    };

    
    const handleIngredienteChange = (index, field, value) => {
        setIngredientes(prev =>
            prev.map((item, i) => i === index ? { ...item, [field]: value } : item)
        );
    };

    const handlePasoChange = (index, field, value) => {
        setPasos(prev =>
            prev.map((item, i) => i === index ? { ...item, [field]: value } : item)
        );
    };

    const handleAddIngrediente = () => {
        setIngredientes(prev => [...prev, {
            nombre: '',
            cantidad: '',
            unidad: '',
            descripcion: ''
        }]);
    };

    const handleAddPaso = () => {
        setPasos(prev => [...prev, {
            descripcion: '',
            orden: prev.length + 1,
            fotoUrl: ''
        }]);
    };

    const handleRemoveIngrediente = (index) => {
        setIngredientes(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemovePaso = (index) => {
        setPasos(prev => {
            const newPasos = prev.filter((_, i) => i !== index);
            // Reordenar los pasos
            return newPasos.map((paso, i) => ({
                ...paso,
                orden: i + 1
            }));
        });
    };

    // --- Validación (se mantiene igual) ---

    const validate = () => {
        if (!formData.titulo || !formData.descripcion || !formData.paisId) {
            setError('🚨 Por favor, completa los campos de Título, Descripción y País.');
            return false;
        }
        if (!formData.duracionMinutos || formData.duracionMinutos < 1) {
            setError('🚨 La duración debe ser mayor a 0 minutos.');
            return false;
        }
        if (!formData.dificultad) {
            setError('🚨 Por favor, selecciona una dificultad.');
            return false;
        }

        // Validar ingredientes
        const ingredientesValidos = ingredientes.some(i => 
            i.nombre.trim() && i.cantidad.trim() && i.unidad.trim()
        );
        if (!ingredientesValidos) {
            setError('🚨 Debes añadir al menos un ingrediente con nombre, cantidad y unidad.');
            return false;
        }

        // Validar pasos
        const pasosValidos = pasos.some(p => p.descripcion.trim());
        if (!pasosValidos) {
            setError('🚨 Debes describir al menos un paso.');
            return false;
        }

        return true;
    };


    // --- SIMULACIÓN de Envío (se mantiene igual) ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validación del formulario
        if (!validate()) return;

        // Verificar si el usuario está logueado
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError('🔐 Debes iniciar sesión para registrar una receta');
            return;
        }

        setIsSubmitting(true);

        try {
            // Preparar el objeto JSON con los campos requeridos
            const recetaData = {
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                duracionMinutos: parseInt(formData.duracionMinutos),
                dificultad: formData.dificultad,
                fotoUrl: formData.fotoUrl,
                paisId: parseInt(formData.paisId),
                ingredientes: ingredientes
                    .filter(i => i.nombre.trim() && i.cantidad.trim() && i.unidad.trim())
                    .map(i => ({
                        nombre: i.nombre.trim(),
                        cantidad: i.cantidad.trim(),
                        unidad: i.unidad.trim(),
                        descripcion: i.descripcion.trim()
                    })),
                pasos: pasos
                    .filter(p => p.descripcion.trim())
                    .map((p, index) => ({
                        orden: index + 1,
                        descripcion: p.descripcion.trim(),
                        fotoUrl: p.fotoUrl.trim()
                    }))
            };

            // Enviar petición al backend como JSON
            const response = await fetch(`${API_BASE_URL}/api/recetas`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recetaData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar la receta');
            }

            // Éxito - limpiar formulario
            alert('✅ Receta registrada con éxito!');
            setFormData({
                titulo: '',
                descripcion: '',
                paisId: '',
                fotoUrl: '',
                duracionMinutos: 30,
                dificultad: 'Media'
            });
            setIngredientes(['']);
            setPasos(['']);
            
            // Llamar al callback de éxito si existe
            if (onRecipeSuccess) {
                onRecipeSuccess();
            }

        } catch (err) {
            setError(`❌ ${err.message || 'Error al registrar la receta'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDERIZADO AJUSTADO A PÁGINA ---

    return (
        // 💡 CAMBIO 1: max-w-3xl para más espacio. mx-auto para centrar.
        // 💡 CAMBIO 2: py-10 px-4 para padding general. ELIMINAMOS mt-10.
        <div className="max-w-3xl mx-auto py-10 px-4 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
            
            {/* TÍTULO */}
            <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8">
                Cadastrar Nova Receta
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8"> 

                {error && (
                    <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded text-center font-medium">
                        {error}
                    </div>
                )}
                
                {/* 1. Campos Básicos */}
                <div className="space-y-4">
                     {/* Campos de texto y textarea */}
                      <input
                        type="text"
                        name="titulo"
                        placeholder="Título de la Receta"
                        value={formData.titulo}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                        required
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Duración (minutos)
                            </label>
                            <input
                                type="number"
                                name="duracionMinutos"
                                min="1"
                                value={formData.duracionMinutos}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Dificultad
                            </label>
                            <select
                                name="dificultad"
                                value={formData.dificultad}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                required
                            >
                                <option value="Fácil">Fácil</option>
                                <option value="Media">Media</option>
                                <option value="Difícil">Difícil</option>
                            </select>
                        </div>
                    </div>
                    <textarea
                        name="descripcion"
                        placeholder="Descripción corta de la receta"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                        required
                    />
                    
                    {/* Select de País (paisId) */}
                    <select
                        name="paisId"
                        value={formData.paisId}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
                        required
                        disabled={countries.length === 0} 
                    >
                        <option value="" className="bg-white dark:bg-gray-700">-- Selecciona el País --</option>
                        {countries.map(pais => (
                            <option key={pais.id} value={pais.id} className="bg-white dark:bg-gray-700">{pais.nombre}</option>
                        ))}
                    </select>

                    {/* URL de la Foto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            URL de la Foto de la Receta
                        </label>
                        <input
                            type="url"
                            name="fotoUrl"
                            placeholder="https://ejemplo.com/foto.jpg"
                            value={formData.fotoUrl}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* 2. Lista de Ingredientes */}
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b-2 dark:border-gray-600 pb-3 pt-4">Ingredientes</h3>
                <div className="space-y-4">
                    {ingredientes.map((ingrediente, index) => (
                        <div key={index} className="flex flex-col gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Nombre del ingrediente"
                                    value={ingrediente.nombre}
                                    onChange={(e) => handleIngredienteChange(index, 'nombre', e.target.value)}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Cantidad (ej: 200)"
                                    value={ingrediente.cantidad}
                                    onChange={(e) => handleIngredienteChange(index, 'cantidad', e.target.value)}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Unidad (ej: gramos)"
                                    value={ingrediente.unidad}
                                    onChange={(e) => handleIngredienteChange(index, 'unidad', e.target.value)}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Descripción (opcional)"
                                    value={ingrediente.descripcion}
                                    onChange={(e) => handleIngredienteChange(index, 'descripcion', e.target.value)}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            {ingredientes.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveIngrediente(index)}
                                    className="self-end text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-semibold"
                                >
                                    Eliminar ingrediente
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddIngrediente}
                        className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md"
                    >
                        + Agregar Ingrediente
                    </button>
                </div>

                {/* 3. Lista de Pasos */}
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b-2 dark:border-gray-600 pb-3 pt-4">Pasos de Preparación</h3>
                <div className="space-y-4">
                    {pasos.map((paso, index) => (
                        <div key={index} className="flex flex-col gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <span className="font-semibold">Paso {paso.orden}</span>
                            </div>
                            <textarea
                                placeholder="Describe el paso de forma clara"
                                value={paso.descripcion}
                                onChange={(e) => handlePasoChange(index, 'descripcion', e.target.value)}
                                rows="3"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                required
                            />
                            <input
                                type="url"
                                placeholder="URL de la foto del paso (opcional)"
                                value={paso.fotoUrl}
                                onChange={(e) => handlePasoChange(index, 'fotoUrl', e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            {pasos.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemovePaso(index)}
                                    className="self-end text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-semibold"
                                >
                                    Eliminar paso
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddPaso}
                        className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition shadow-md"
                    >
                        + Agregar Paso
                    </button>
                </div>

                {/* Botón de Envío FINAL */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-4 rounded-lg shadow-xl text-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 transition duration-150 mt-6"
                >
                    {isSubmitting ? 'Guardando Receta...' : 'Cadastrar Receta'}
                </button>
            </form>
        </div>
    );
}