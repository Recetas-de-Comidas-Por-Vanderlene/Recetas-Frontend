// EditRecipe.jsx
// Función para decodificar JWT (base64)
function parseJwt (token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8080';

const DUMMY_COUNTRIES = [
  { id: '3', nombre: 'Brasil' },
  { id: '4', nombre: 'México' },
  { id: '5', nombre: 'España' },
  { id: '6', nombre: 'Italia' },
  { id: '7', nombre: 'Japón' },
  { id: '8', nombre: 'India' },
];

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);

  // Estados para animación de guardado
  const [isSaving, setIsSaving] = useState(false);

  // Función para eliminar ingredientes duplicados
  const removeDuplicateIngredients = (ingredientes) => {
    if (!Array.isArray(ingredientes)) return [];
    
    const seen = new Set();
    return ingredientes.filter(ing => {
      const key = `${ing.nombre}-${ing.cantidad}-${ing.unidad}-${ing.descripcion}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };


  const removeDuplicateSteps = (pasos) => {
    if (!Array.isArray(pasos)) return [];
    

    const uniqueSteps = pasos
      .filter(paso => paso && paso.descripcion && paso.descripcion.trim() !== '')
      .reduce((acc, paso) => {
        const descripcion = paso.descripcion.trim();
        const existing = acc.find(p => p.descripcion.trim() === descripcion);
        if (!existing) {
          acc.push({
            descripcion: descripcion,
            fotoUrl: paso.fotoUrl || ''
          });
        }
        return acc;
      }, []);
    
    return uniqueSteps.map((paso, index) => ({
      orden: index + 1,
      descripcion: paso.descripcion,
      fotoUrl: paso.fotoUrl
    }));
  };

  useEffect(() => {
    setCountries(DUMMY_COUNTRIES);
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/recetas/${id}`);
        if (!response.ok) throw new Error('No se pudo cargar la receta.');
        const data = await response.json();
  
        let paisId = data.paisId;
        if (!paisId && data.pais) {
          const found = DUMMY_COUNTRIES.find(c => c.nombre === data.pais);
          paisId = found ? found.id : '';
        }
        console.log('Datos originales del backend:', data);
        console.log('Ingredientes originales:', data.ingredientes);
        
      
        const cleanIngredientes = removeDuplicateIngredients(data.ingredientes || []);
        const cleanPasos = removeDuplicateSteps(data.pasos || []);
        console.log('Ingredientes procesados:', cleanIngredientes);
        console.log('Pasos procesados:', cleanPasos);
        
        setRecipe({ ...data, paisId, ingredientes: cleanIngredientes, pasos: cleanPasos });
       
        console.log('autorId de la receta:', data.autorId);

        const token = localStorage.getItem('jwtToken');
        const user = parseJwt(token);
        console.log('ID usuario autenticado (token):', user && (user.id || user.sub));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleChange = e => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleAddIngredient = () => {
    setRecipe({
      ...recipe,
      ingredientes: [...(recipe.ingredientes || []), { nombre: '', cantidad: '', unidad: '', descripcion: '' }]
    });
  };

  const handleRemoveIngredient = (idx) => {
    const newIngs = (recipe.ingredientes || []).filter((_, i) => i !== idx);
    setRecipe({ ...recipe, ingredientes: newIngs });
  };

  const handleIngredientChange = (idx, field, value) => {
    const newIngs = [...(recipe.ingredientes || [])];
    newIngs[idx] = { ...newIngs[idx], [field]: value };
    setRecipe({ ...recipe, ingredientes: newIngs });
  };

  const handleAddStep = () => {
    const currentPasos = recipe.pasos || [];
    setRecipe({
      ...recipe,
      pasos: [...currentPasos, {
        descripcion: '',
        fotoUrl: '',
        orden: currentPasos.length + 1
      }]
    });
  };

  const handleRemoveStep = (idx) => {
    const newPasos = (recipe.pasos || []).filter((_, i) => i !== idx);
    setRecipe({ ...recipe, pasos: newPasos });
  };

  const handleStepChange = (idx, field, value) => {
    const newPasos = [...(recipe.pasos || [])];
    newPasos[idx] = { ...newPasos[idx], [field]: value };
    setRecipe({ ...recipe, pasos: newPasos });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    console.log('Estado actual de la receta antes del submit:', recipe);
    console.log('Ingredientes antes del submit:', recipe.ingredientes);
    console.log('Pasos antes del submit:', recipe.pasos);
    
    try {
      // Procesar los pasos antes de enviar
      const procesarPasos = (pasos) => {
        if (!Array.isArray(pasos)) return [];
        
        // Filtrar pasos vacíos y duplicados
        const uniqueSteps = (pasos || [])
          .filter(paso => paso && paso.descripcion && paso.descripcion.trim() !== '')
          .reduce((acc, paso) => {
            const descripcion = paso.descripcion.trim();
            const existing = acc.find(p => p.descripcion.trim() === descripcion);
            if (!existing) {
              acc.push({
                descripcion: descripcion,
                fotoUrl: paso.fotoUrl || ''
              });
            }
            return acc;
          }, []);
      
        return uniqueSteps.map((paso, index) => ({
          orden: index + 1,
          descripcion: paso.descripcion,
          fotoUrl: paso.fotoUrl
        }));
      };

      const validPasos = procesarPasos(recipe.pasos);
      
      console.log('Pasos procesados antes de enviar:', validPasos);

    
      const payload = {
        titulo: recipe.titulo,
        descripcion: recipe.descripcion,
        duracionMinutos: Number(recipe.duracionMinutos),
        dificultad: recipe.dificultad,
        fotoUrl: recipe.fotoUrl,
        paisId: recipe.paisId ? Number(recipe.paisId) : undefined,
        ingredientes: (recipe.ingredientes || []).map(ing => ({
          nombre: ing.nombre,
          descripcion: ing.descripcion,
          cantidad: ing.cantidad,
          unidad: ing.unidad
        })).filter(ing => ing.nombre && ing.nombre.trim() !== ''),
        pasos: validPasos 
      };

      console.log('Payload completo enviado:', payload);
      console.log('Ingredientes en payload:', payload.ingredientes);
      console.log('Pasos en payload:', payload.pasos);

      const token = localStorage.getItem('jwtToken');
      
    
      console.log('Enviando actualización de receta...');
      setIsSaving(true);
      const response = await fetch(`${API_BASE_URL}/api/recetas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = 'No se pudo actualizar la receta.';
        try {
          const errorData = await response.json();
          if (errorData && errorData.mensaje) errorMsg = errorData.mensaje;
        } catch {}
        throw new Error(errorMsg);
      }
      
      const updatedData = await response.json();
      console.log('Respuesta del backend después del update:', updatedData);
      
   
      const savedPasos = updatedData.pasos || [];
      console.log('Pasos guardados en el backend:', savedPasos);
      
    
      toast.success('✅ Receta actualizada con éxito', {
        style: {
          background: 'linear-gradient(90deg,#ff6fb5,#8b5cf6)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(139,92,246,0.25)'
        },
        icon: '✅'
      });


      setTimeout(() => {
        setIsSaving(false);
        navigate('/recetas');
      }, 700);
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
      toast.error('Error al guardar la receta: ' + err.message, {
        style: {
          background: 'linear-gradient(90deg,#f87171,#fb923c)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '12px',
        }
      });
      alert('Error al guardar la receta: ' + err.message);
    }
  };

  if (loading) return <div className="text-center p-12 text-lg text-gray-500">Cargando receta...</div>;
  if (error) return <div className="text-center p-12 text-lg text-red-500">{error}</div>;
  if (!recipe) return null;

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
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Editar Receta
        </h1>
{/* Botón volver */}
<div className="flex justify-start mb-6">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigate('/recetas')} 
    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
  >
    <span className="text-lg">←</span>
    <span>Volver</span>
  </motion.button>
</div>


        <form id="edit-recipe-form" onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block font-semibold mb-1">Título</label>
            <input
              type="text"
              name="titulo"
              value={recipe.titulo || ''}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={recipe.descripcion || ''}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Duración (minutos)</label>
              <input
                type="number"
                name="duracionMinutos"
                value={recipe.duracionMinutos || ''}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Dificultad</label>
              <select
                name="dificultad"
                value={recipe.dificultad || ''}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm"
                required
              >
                <option value="">Selecciona dificultad</option>
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Foto (URL)</label>
              <input
                type="text"
                name="fotoUrl"
                value={recipe.fotoUrl || ''}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">País</label>
            <select
              name="paisId"
              value={recipe.paisId || ''}
              onChange={e => setRecipe({ ...recipe, paisId: e.target.value })}
              className="w-full p-3 border rounded-lg bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm"
              required
              disabled={countries.length === 0}
            >
              <option value="">-- Selecciona el País --</option>
              {countries.map(pais => (
                <option key={pais.id} value={pais.id}>{pais.nombre}</option>
              ))}
            </select>
          </div>

          {/* Ingredientes */}
          <div>
            <label className="block font-semibold mb-3">Ingredientes</label>

            <AnimatePresence>
              {(recipe.ingredientes || []).map((ing, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  layout
                  className="mb-3 p-3 rounded-lg bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm flex gap-2 items-center"
                >
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={ing.nombre || ''}
                    onChange={e => handleIngredientChange(idx, 'nombre', e.target.value)}
                    className="p-2 border rounded w-1/4 bg-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Cantidad"
                    value={ing.cantidad || ''}
                    onChange={e => handleIngredientChange(idx, 'cantidad', e.target.value)}
                    className="p-2 border rounded w-1/4 bg-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Unidad"
                    value={ing.unidad || ''}
                    onChange={e => handleIngredientChange(idx, 'unidad', e.target.value)}
                    className="p-2 border rounded w-1/4 bg-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={ing.descripcion || ''}
                    onChange={e => handleIngredientChange(idx, 'descripcion', e.target.value)}
                    className="p-2 border rounded w-1/4 bg-transparent"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveIngredient(idx)}
                    className="text-red-500 ml-2"
                    type="button"
                  >
                    Eliminar
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddIngredient}
              type="button"
              className="mt-2 bg-green-500 text-white px-3 py-2 rounded-full"
            >
              Agregar ingrediente
            </motion.button>
          </div>

          {/* Pasos */}
          <div>
            <label className="block font-semibold mb-3">Pasos</label>

            <AnimatePresence>
              {(recipe.pasos || []).map((paso, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  layout
                  className="mb-3 p-3 rounded-lg bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm flex gap-2 items-center"
                >
                  <input
                    type="text"
                    placeholder={`Paso ${idx + 1}`}
                    value={paso.descripcion || ''}
                    onChange={e => handleStepChange(idx, 'descripcion', e.target.value)}
                    className="p-2 border rounded w-2/3 bg-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Foto URL (opcional)"
                    value={paso.fotoUrl || ''}
                    onChange={e => handleStepChange(idx, 'fotoUrl', e.target.value)}
                    className="p-2 border rounded w-1/3 bg-transparent"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveStep(idx)}
                    className="text-red-500 ml-2"
                    type="button"
                  >
                    Eliminar
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddStep}
              type="button"
              className="mt-2 bg-green-500 text-white px-3 py-2 rounded-full"
            >
              Agregar paso
            </motion.button>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className={`bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg`}
            >
              Guardar Cambios
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditRecipe;
