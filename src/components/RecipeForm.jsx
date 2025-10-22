// src/components/RecipeForm.jsx (Diseño de Página Completa)

import React, { useState, useEffect } from 'react';

// Datos de países simulados
const DUMMY_COUNTRIES = [
    { id: '1', nombre: 'México' },
    { id: '2', nombre: 'Colombia' },
    { id: '3', nombre: 'Perú' },
    { id: '4', nombre: 'Argentina' },
];

export default function RecipeForm({ onRecipeSuccess }) {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        paisId: '',
        foto: null, 
    });
    const [ingredientes, setIngredientes] = useState(['']);
    const [pasos, setPasos] = useState(['']);
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

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setFormData(prevData => ({ ...prevData, foto: file }));
        setError('');
    };
    
    const handleListItemChange = (type, index, value) => {
        const setter = type === 'ingredientes' ? setIngredientes : setPasos;
        const currentList = type === 'ingredientes' ? ingredientes : pasos;

        const updatedList = currentList.map((item, i) => 
            i === index ? value : item
        );
        setter(updatedList);
    };

    const handleAddListItem = (type) => {
        const setter = type === 'ingredientes' ? setIngredientes : setPasos;
        setter(prevList => [...prevList, '']);
    };

    const handleRemoveListItem = (type, index) => {
        const setter = type === 'ingredientes' ? setIngredientes : setPasos;
        setter(prevList => prevList.filter((_, i) => i !== index));
    };

    // --- Validación (se mantiene igual) ---

    const validate = () => {
        if (!formData.nombre || !formData.descripcion || !formData.paisId) {
            setError('🚨 Por favor, completa los campos de Nombre, Descripción y País.');
            return false;
        }
        if (ingredientes.filter(i => i.trim()).length === 0) {
            setError('🚨 Debes añadir al menos un ingrediente.');
            return false;
        }
        if (pasos.filter(p => p.trim()).length === 0) {
            setError('🚨 Debes describir al menos un paso.');
            return false;
        }
        return true;
    };


    // --- SIMULACIÓN de Envío (se mantiene igual) ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

        setIsSubmitting(true);
        
        console.log("--- Datos de Receta a Guardar (Simulado) ---");
        // ... (resto del log) ...
        
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        try {
            alert('✅ Receta registrada con éxito! (Simulación de backend)');
            
            // Limpiar formulario
            setFormData({ nombre: '', descripcion: '', paisId: '', foto: null });
            setIngredientes(['']);
            setPasos(['']);
            
            // Llama al handler de éxito (ej: volver a la vista HOME en App.jsx)
            if (onRecipeSuccess) onRecipeSuccess(); 

        } catch (err) {
            setError('❌ Error interno de simulación.');
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
                        name="nombre"
                        placeholder="Nombre de la Receta"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                        required
                    />
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

                    {/* Subida de Foto */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Subir Foto de la Receta
                        </label>
                        <input
                            type="file"
                            name="foto"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="w-full text-base text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900 dark:file:text-orange-300 dark:hover:file:bg-orange-800"
                        />
                        {formData.foto && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Archivo seleccionado: {formData.foto.name}</p>}
                    </div>
                </div>

                {/* 2. Lista de Ingredientes */}
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b-2 dark:border-gray-600 pb-3 pt-4">Ingredientes</h3>
                <div className="space-y-4">
                    {ingredientes.map((ingrediente, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <input
                                type="text"
                                placeholder={`Ej: 200g de Harina`}
                                value={ingrediente}
                                onChange={(e) => handleListItemChange('ingredientes', index, e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                            />
                            {ingredientes.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveListItem('ingredientes', index)}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-3xl font-bold transition-colors"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddListItem('ingredientes')}
                        className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md"
                    >
                        + Agregar Ingrediente
                    </button>
                </div>

                {/* 3. Lista de Pasos */}
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b-2 dark:border-gray-600 pb-3 pt-4">Pasos de Preparación</h3>
                <div className="space-y-4">
                    {pasos.map((paso, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <textarea
                                placeholder={`Paso ${index + 1}: Describe el paso de forma clara.`}
                                value={paso}
                                onChange={(e) => handleListItemChange('pasos', index, e.target.value)}
                                rows="3"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                            />
                            {pasos.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveListItem('pasos', index)}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-3xl font-bold transition-colors"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddListItem('pasos')}
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