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

  useEffect(() => {
    setCountries(DUMMY_COUNTRIES);
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/recetas/${id}`);
        if (!response.ok) throw new Error('No se pudo cargar la receta.');
        const data = await response.json();
        // Si la receta tiene país como string, intenta mapearlo a un id
        let paisId = data.paisId;
        if (!paisId && data.pais) {
          const found = DUMMY_COUNTRIES.find(c => c.nombre === data.pais);
          paisId = found ? found.id : '';
        }
        setRecipe({ ...data, paisId });
        // Mostrar autorId de la receta
        console.log('autorId de la receta:', data.autorId);
        // Mostrar id del usuario autenticado
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

  const handleSubmit = async e => {
    e.preventDefault();
    // Prepara el payload solo con los campos requeridos
    const payload = {
      titulo: recipe.titulo,
      descripcion: recipe.descripcion,
      duracionMinutos: Number(recipe.duracionMinutos),
      dificultad: recipe.dificultad,
      fotoUrl: recipe.fotoUrl,
      paisId: recipe.paisId ? Number(recipe.paisId) : undefined,
      ingredientes: (recipe.ingredientes || []).map(ing => ({
        ingredienteId: ing.ingredienteId || ing.id,
        nombre: ing.nombre,
        descripcion: ing.descripcion,
        cantidad: ing.cantidad,
        unidad: ing.unidad
      })),
      pasos: (recipe.pasos || []).map((paso, idx) => ({
        orden: idx + 1,
        descripcion: paso.descripcion,
        fotoUrl: paso.fotoUrl
      }))
    };
    console.log('Payload enviado:', payload);
    try {
  const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${API_BASE_URL}/api/recetas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        // Intenta leer el mensaje real del backend
        let errorMsg = 'No se pudo actualizar la receta.';
        try {
          const errorData = await response.json();
          if (errorData && errorData.mensaje) errorMsg = errorData.mensaje;
        } catch {}
        throw new Error(errorMsg);
      }
      alert('Receta editada correctamente.');
      setTimeout(() => {
        navigate('/recetas');
      }, 100);
    } catch (err) {
      setError(err.message);
      alert('Error al guardar la receta: ' + err.message);
    }
  };

  if (loading) return <div className="text-center p-12 text-lg text-gray-500">Cargando receta...</div>;
  if (error) return <div className="text-center p-12 text-lg text-red-500">{error}</div>;
  if (!recipe) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Editar Receta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Título</label>
          <input
            type="text"
            name="titulo"
            value={recipe.titulo || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={recipe.descripcion || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Duración (minutos)</label>
          <input
            type="number"
            name="duracionMinutos"
            value={recipe.duracionMinutos || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">País</label>
          <select
            name="paisId"
            value={recipe.paisId || ''}
            onChange={e => setRecipe({ ...recipe, paisId: e.target.value })}
            className="w-full p-2 border rounded"
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
          <label className="block font-semibold mb-1">Ingredientes</label>
          {Array.isArray(recipe.ingredientes) && recipe.ingredientes.map((ing, idx) => (
            <div key={idx} className="mb-2 flex gap-2 items-center">
              <input
                type="text"
                placeholder="Nombre"
                value={ing.nombre || ''}
                onChange={e => {
                  const newIngs = [...recipe.ingredientes];
                  newIngs[idx].nombre = e.target.value;
                  setRecipe({ ...recipe, ingredientes: newIngs });
                }}
                className="p-2 border rounded w-1/4"
                required
              />
              <input
                type="text"
                placeholder="Cantidad"
                value={ing.cantidad || ''}
                onChange={e => {
                  const newIngs = [...recipe.ingredientes];
                  newIngs[idx].cantidad = e.target.value;
                  setRecipe({ ...recipe, ingredientes: newIngs });
                }}
                className="p-2 border rounded w-1/4"
                required
              />
              <input
                type="text"
                placeholder="Unidad"
                value={ing.unidad || ''}
                onChange={e => {
                  const newIngs = [...recipe.ingredientes];
                  newIngs[idx].unidad = e.target.value;
                  setRecipe({ ...recipe, ingredientes: newIngs });
                }}
                className="p-2 border rounded w-1/4"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={ing.descripcion || ''}
                onChange={e => {
                  const newIngs = [...recipe.ingredientes];
                  newIngs[idx].descripcion = e.target.value;
                  setRecipe({ ...recipe, ingredientes: newIngs });
                }}
                className="p-2 border rounded w-1/4"
              />
              <button type="button" className="text-red-500 ml-2" onClick={() => {
                const newIngs = recipe.ingredientes.filter((_, i) => i !== idx);
                setRecipe({ ...recipe, ingredientes: newIngs });
              }}>Eliminar</button>
            </div>
          ))}
          <button type="button" className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => {
            setRecipe({
              ...recipe,
              ingredientes: [...(recipe.ingredientes || []), { nombre: '', cantidad: '', unidad: '', descripcion: '' }]
            });
          }}>Agregar ingrediente</button>
        </div>

        {/* Pasos */}
        <div>
          <label className="block font-semibold mb-1">Pasos</label>
          {Array.isArray(recipe.pasos) && recipe.pasos.map((paso, idx) => (
            <div key={idx} className="mb-2 flex gap-2 items-center">
              <input
                type="text"
                placeholder={`Paso ${idx + 1}`}
                value={paso.descripcion || ''}
                onChange={e => {
                  const newPasos = [...recipe.pasos];
                  newPasos[idx].descripcion = e.target.value;
                  setRecipe({ ...recipe, pasos: newPasos });
                }}
                className="p-2 border rounded w-2/3"
                required
              />
              <input
                type="text"
                placeholder="Foto URL (opcional)"
                value={paso.fotoUrl || ''}
                onChange={e => {
                  const newPasos = [...recipe.pasos];
                  newPasos[idx].fotoUrl = e.target.value;
                  setRecipe({ ...recipe, pasos: newPasos });
                }}
                className="p-2 border rounded w-1/3"
              />
              <button type="button" className="text-red-500 ml-2" onClick={() => {
                const newPasos = recipe.pasos.filter((_, i) => i !== idx);
                setRecipe({ ...recipe, pasos: newPasos });
              }}>Eliminar</button>
            </div>
          ))}
          <button type="button" className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => {
            setRecipe({
              ...recipe,
              pasos: [...(recipe.pasos || []), { descripcion: '', fotoUrl: '' }]
            });
          }}>Agregar paso</button>
        </div>
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;