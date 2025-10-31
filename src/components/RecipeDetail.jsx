// Guardar edición de comentario
    const handleEditSave = async (commentId) => {
        try {
            const payload = {
                comentario: editCommentText,
                valoracion: editCommentRating,
            };
            const response = await fetch(`${API_BASE_URL}/api/recetas/${id}/comentarios/${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('No se pudo editar el comentario');
            setEditingCommentId(null);
            await fetchComments();
        } catch (err) {
            alert('Error al editar el comentario: ' + err.message);
        }
    };
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

const RecipeDetail = ({ isLoggedIn }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Estados para edición de comentario
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [editCommentRating, setEditCommentRating] = useState(0);


    // Cargar receta y comentarios juntos (al inicio)
    const fetchRecipe = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/recetas/${id}`);
            if (!response.ok) throw new Error('No se pudo cargar la receta.');
            const data = await response.json();
            setRecipe(data);
            setComments(data.comentarios || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Solo recargar comentarios (después de comentar)
    const fetchComments = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/recetas/${id}`);
            if (!response.ok) throw new Error('No se pudo cargar la receta.');
            const data = await response.json();
            setComments(data.comentarios || []);
        } catch (err) {
            // No actualizar error global para no romper la UI
        }
    };

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('No se encontró el usuario. Por favor, vuelve a iniciar sesión.');
            return;
        }
        const payload = {
            usuarioId: Number(userId),
            comentario: newComment,
            valoracion: rating,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/recetas/${id}/comentarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('No se pudo guardar el comentario');
            // Recargar solo los comentarios, no toda la receta
            await fetchComments();
            setNewComment('');
            setRating(0);
        } catch (err) {
            alert('Error al guardar el comentario: ' + err.message);
        }
    };

    if (isLoading) return <div className="text-center p-12 text-lg text-gray-500">Cargando receta...</div>;
    if (error) return <div className="text-center p-12 text-lg text-red-500">{error}</div>;
    if (!recipe) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">

            {/* Título */}
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">{recipe.titulo}</h1>

                        {/* Debug: Mostrar valores para depuración */}

                        {/* Botón Editar Receta (solo si es el dueño) */}
                        {isLoggedIn && String(recipe.autorId) === String(localStorage.getItem('userId')) && (
                            <button
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full mb-6"
                                onClick={() => navigate(`/recetas/${id}/editar`)}
                            >
                                Editar receta
                            </button>
                        )}

            {/* Foto */}
            {recipe.fotoUrl && (
                <img src={recipe.fotoUrl} alt={recipe.titulo} className="w-full h-64 object-cover rounded-lg mb-6" />
            )}

            {/* Descripción */}
            <p className="mb-4 text-gray-700 dark:text-gray-300">{recipe.descripcion}</p>

            {/* Ingredientes */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Ingredientes</h2>
                <ul className="list-disc list-inside">
                    {Array.isArray(recipe.ingredientes) && recipe.ingredientes.length > 0 ? (
                        recipe.ingredientes.map((ing, idx) => (
                            <li key={idx}>
                                <span className="font-semibold">{ing.nombre}</span>
                                {` - ${ing.cantidad} ${ing.unidad}`}
                                {ing.descripcion && <span className="text-gray-500"> ({ing.descripcion})</span>}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-400">No hay ingredientes registrados.</li>
                    )}
                </ul>
            </div>

            {/* Paso a paso */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Paso a paso</h2>
                <ol className="list-decimal list-inside">
                    {Array.isArray(recipe.pasos) && recipe.pasos.length > 0 ? (
                        recipe.pasos
                            .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                            .map((paso, idx) => (
                                <li key={idx} className="mb-2">
                                    <span>{paso.descripcion}</span>
                                    {paso.fotoUrl && paso.fotoUrl.trim() && (
                                        <div className="mt-2">
                                            <img src={paso.fotoUrl} alt={`Paso ${idx + 1}`} className="w-full max-w-xs rounded shadow" />
                                        </div>
                                    )}
                                </li>
                            ))
                    ) : (
                        <li className="text-gray-400">No hay pasos registrados.</li>
                    )}
                </ol>
            </div>

            {/* Tiempo, Dificultad, País */}
            <div className="flex flex-wrap gap-4 mb-6 text-gray-700 dark:text-gray-300">
                {recipe.tiempo && (
                    <div>
                        <span className="font-semibold">Tiempo:</span> {recipe.tiempo}
                    </div>
                )}
                {recipe.dificultad && (
                    <div>
                        <span className="font-semibold">Dificultad:</span> {recipe.dificultad}
                    </div>
                )}
                {recipe.pais && (
                    <div>
                        <span className="font-semibold">País:</span> {recipe.pais}
                    </div>
                )}
            </div>

            {/* Comentarios y Valoraciones */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Comentarios y Valoraciones</h2>
                {comments.length === 0 ? (
                    <p className="text-gray-500">No hay comentarios aún.</p>
                ) : (
                    <ul className="space-y-2">
                        {comments.map((c, idx) => (
                            <li key={idx} className="border-b pb-2">
                                {editingCommentId === c.id ? (
                                    <div>
                                        <textarea
                                            className="w-full p-2 rounded mb-2"
                                            rows={2}
                                            value={editCommentText}
                                            onChange={e => setEditCommentText(e.target.value)}
                                        />
                                        <div className="flex items-center mb-2">
                                            <span className="mr-2">Valoración:</span>
                                            {[1,2,3,4,5].map(star => (
                                                <button
                                                    type="button"
                                                    key={star}
                                                    className={star <= editCommentRating ? 'text-yellow-500 text-xl' : 'text-gray-400 text-xl'}
                                                    onClick={() => setEditCommentRating(star)}
                                                >★</button>
                                            ))}
                                        </div>
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                            onClick={() => handleEditSave(c.id)}
                                        >Guardar</button>
                                        <button
                                            className="bg-gray-400 text-white px-3 py-1 rounded"
                                            onClick={() => setEditingCommentId(null)}
                                        >Cancelar</button>
                                    </div>
                                ) : (
                                    <div>
                                        <span className="font-semibold">{c.usuario}:</span> {c.texto} {' '}
                                        <span className="text-yellow-500">{'★'.repeat(c.valoracion || 0)}</span>
                                        <span className="text-xs text-gray-400 ml-2">{c.fecha}</span>
                                        {/* Mostrar botón solo si el comentario es del usuario actual */}
                                        {String(c.usuario?.id) === String(localStorage.getItem('userId')) && (
                                            <button
                                                className="ml-2 text-blue-500 underline"
                                                onClick={() => {
                                                    setEditingCommentId(c.id);
                                                    setEditCommentText(c.texto);
                                                    setEditCommentRating(c.valoracion);
                                                }}
                                            >Editar</button>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Formulario de comentario */}
            {isLoggedIn && (
                <form onSubmit={handleCommentSubmit} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <textarea
                        className="w-full p-2 rounded mb-2"
                        rows={3}
                        placeholder="Escribe tu comentario..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        required
                    />
                    <div className="flex items-center mb-2">
                        <span className="mr-2">Valoración:</span>
                        {[1,2,3,4,5].map(star => (
                            <button
                                type="button"
                                key={star}
                                className={star <= rating ? 'text-yellow-500 text-xl' : 'text-gray-400 text-xl'}
                                onClick={() => setRating(star)}
                            >★</button>
                        ))}
                    </div>
                    <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full">Enviar</button>
                </form>
            )}
        </div>
    );
};

export default RecipeDetail;