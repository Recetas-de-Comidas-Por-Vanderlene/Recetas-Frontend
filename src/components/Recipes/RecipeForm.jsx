// src/components/RecipeForm.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

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

  useEffect(() => {
    setCountries(DUMMY_COUNTRIES);
  }, []);

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
    setIngredientes(prev => [...prev, { nombre: '', cantidad: '', unidad: '', descripcion: '' }]);
  };

  const handleAddPaso = () => {
    setPasos(prev => [...prev, { descripcion: '', orden: prev.length + 1, fotoUrl: '' }]);
  };

  const handleRemoveIngrediente = (index) => {
    setIngredientes(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemovePaso = (index) => {
    setPasos(prev => {
      const newPasos = prev.filter((_, i) => i !== index);
      return newPasos.map((paso, i) => ({ ...paso, orden: i + 1 }));
    });
  };

  const validate = () => {
    if (!formData.titulo || !formData.descripcion || !formData.paisId) {
      setError('🚨 Completa los campos de Título, Descripción y País.');
      return false;
    }
    if (!formData.duracionMinutos || formData.duracionMinutos < 1) {
      setError('🚨 La duración debe ser mayor a 0 minutos.');
      return false;
    }
    if (!formData.dificultad) {
      setError('🚨 Por favor selecciona una dificultad.');
      return false;
    }
    const ingredientesValidos = ingredientes.some(i =>
      i.nombre.trim() && i.cantidad.trim() && i.unidad.trim()
    );
    if (!ingredientesValidos) {
      setError('🚨 Añade al menos un ingrediente válido.');
      return false;
    }
    const pasosValidos = pasos.some(p => p.descripcion.trim());
    if (!pasosValidos) {
      setError('🚨 Añade al menos un paso de preparación.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('🔐 Debes iniciar sesión para registrar una receta');
      return;
    }

    setIsSubmitting(true);

    try {
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

      const nuevaReceta = await response.json();

      toast.success('✅ Receta registrada con éxito', {
        style: {
          background: 'linear-gradient(90deg,#ff6fb5,#8b5cf6)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(139,92,246,0.25)'
        }
      });

      setTimeout(() => {
        navigate(`/recetas/${nuevaReceta.id}`);
      }, 800);

      if (onRecipeSuccess) onRecipeSuccess();
    } catch (err) {
      toast.error(`❌ ${err.message}`, {
        style: {
          background: 'linear-gradient(90deg,#f87171,#fb923c)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '12px',
        }
      });
      setError(`❌ ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Toaster position="top-right" />

      <motion.div
        className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Crear Nueva Receta
        </h2>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded text-center font-medium mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campos principales */}
          <div className="space-y-4">
            <input
              type="text"
              name="titulo"
              placeholder="Título de la Receta"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Duración (min)</label>
                <input
                  type="number"
                  name="duracionMinutos"
                  min="1"
                  value={formData.duracionMinutos}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg bg-white/70 dark:bg-gray-800/60"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dificultad</label>
                <select
                  name="dificultad"
                  value={formData.dificultad}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg bg-white/70 dark:bg-gray-800/60"
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Media">Media</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>

            <textarea
              name="descripcion"
              placeholder="Descripción corta"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg resize-none bg-white/70 dark:bg-gray-800/60"
              rows="3"
            />

            <select
              name="paisId"
              value={formData.paisId}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg bg-white/70 dark:bg-gray-800/60"
              required
            >
              <option value="">-- Selecciona el País --</option>
              {countries.map(pais => (
                <option key={pais.id} value={pais.id}>{pais.nombre}</option>
              ))}
            </select>

            <input
              type="url"
              name="fotoUrl"
              placeholder="URL de la foto principal"
              value={formData.fotoUrl}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg bg-white/70 dark:bg-gray-800/60"
            />
          </div>

          {/* Ingredientes */}
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b pb-3 pt-4">Ingredientes</h3>
          <AnimatePresence>
            {ingredientes.map((ingrediente, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                layout
                className="p-4 bg-white/60 dark:bg-gray-800/50 rounded-lg flex flex-col gap-3 mb-2"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={ingrediente.nombre}
                    onChange={(e) => handleIngredienteChange(index, 'nombre', e.target.value)}
                    className="p-3 border rounded-lg bg-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Cantidad"
                    value={ingrediente.cantidad}
                    onChange={(e) => handleIngredienteChange(index, 'cantidad', e.target.value)}
                    className="p-3 border rounded-lg bg-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Unidad"
                    value={ingrediente.unidad}
                    onChange={(e) => handleIngredienteChange(index, 'unidad', e.target.value)}
                    className="p-3 border rounded-lg bg-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={ingrediente.descripcion}
                    onChange={(e) => handleIngredienteChange(index, 'descripcion', e.target.value)}
                    className="p-3 border rounded-lg bg-transparent"
                  />
                </div>
                {ingredientes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngrediente(index)}
                    className="self-end text-red-500 text-sm"
                  >
                    Eliminar ingrediente
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={handleAddIngrediente}
            className="w-full py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600"
          >
            + Agregar Ingrediente
          </button>

          {/* Pasos */}
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b pb-3 pt-4">Pasos de Preparación</h3>
          <AnimatePresence>
            {pasos.map((paso, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                layout
                className="p-4 bg-white/60 dark:bg-gray-800/50 rounded-lg flex flex-col gap-3 mb-2"
              >
                <textarea
                  placeholder={`Paso ${index + 1}`}
                  value={paso.descripcion}
                  onChange={(e) => handlePasoChange(index, 'descripcion', e.target.value)}
                  rows="3"
                  className="p-3 border rounded-lg bg-transparent"
                  required
                />
                <input
                  type="url"
                  placeholder="URL foto (opcional)"
                  value={paso.fotoUrl}
                  onChange={(e) => handlePasoChange(index, 'fotoUrl', e.target.value)}
                  className="p-3 border rounded-lg bg-transparent"
                />
                {pasos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePaso(index)}
                    className="self-end text-red-500 text-sm"
                  >
                    Eliminar paso
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={handleAddPaso}
            className="w-full py-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700"
          >
            + Agregar Paso
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
            type="submit"
            className={`w-full py-4 text-xl font-bold text-white rounded-full shadow-xl ${
              isSubmitting ? 'bg-green-400' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
            }`}
          >
            {isSubmitting ? 'Guardando...' : 'Cadastrar Receta'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
