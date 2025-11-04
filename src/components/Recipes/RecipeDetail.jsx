import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:8080";

const RecipeDetail = ({ isLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editCommentRating, setEditCommentRating] = useState(0);

  // ======== funciones de limpieza ========
  const removeDuplicateIngredients = (ingredientes) => {
    if (!Array.isArray(ingredientes)) return [];
    const seen = new Set();
    return ingredientes.filter((ing) => {
      const key = `${ing.nombre}-${ing.cantidad}-${ing.unidad}-${ing.descripcion}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const removeDuplicateSteps = (pasos) => {
    if (!Array.isArray(pasos)) return [];
    const sorted = pasos.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    const seen = new Set();
    const unique = [];
    for (let p of sorted) {
      const key = p.descripcion?.trim().toLowerCase() || "";
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push(p);
      }
    }
    return unique.map((p, i) => ({ ...p, orden: i + 1 }));
  };

  const fetchRecipe = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/recetas/${id}`);
      if (!res.ok) throw new Error("No se pudo cargar la receta.");
      const data = await res.json();
      setRecipe({
        ...data,
        ingredientes: removeDuplicateIngredients(data.ingredientes || []),
        pasos: removeDuplicateSteps(data.pasos || []),
      });
      setComments(data.comentarios || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/recetas/${id}`);
      const data = await res.json();
      setRecipe((prev) => ({
        ...data,
        ingredientes: removeDuplicateIngredients(data.ingredientes || []),
        pasos: removeDuplicateSteps(data.pasos || []),
      }));
      setComments(data.comentarios || []);
    } catch {}
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Inicia sesión nuevamente.");
    const payload = {
      usuarioId: Number(userId),
      comentario: newComment,
      valoracion: rating,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/recetas/${id}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al guardar comentario");
      await fetchComments();
      setNewComment("");
      setRating(0);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditSave = async (commentId) => {
    try {
      const payload = {
        comentario: editCommentText,
        valoracion: editCommentRating,
      };
      const res = await fetch(
        `${API_BASE_URL}/api/recetas/${id}/comentarios/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("No se pudo editar el comentario");
      setEditingCommentId(null);
      await fetchComments();
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading)
    return (
      <div className="text-center text-gray-400 p-12">Cargando receta...</div>
    );
  if (error)
    return <div className="text-center text-red-500 p-12">{error}</div>;
  if (!recipe) return null;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* ===== Botón Volver ===== */}
        <div className="flex justify-start mb-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/recetas")}
            className="px-2 py-2 rounded-full text-white font-semibold shadow-lg
              bg-gradient-to-r from-orange-500 to-orange-500 hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            ← Volver a Recetas
          </motion.button>
        </div>

        {/* ===== Título de la receta ===== */}
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          {recipe.titulo}
        </h1>

        {isLoggedIn &&
          String(recipe.autorId) === String(localStorage.getItem("userId")) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/recetas/${id}/editar`)}
              className="mx-auto block mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-5 py-2 rounded-full shadow-lg"
            >
              ✏️ Editar receta
            </motion.button>
          )}

        {recipe.fotoUrl && (
          <motion.img
            src={recipe.fotoUrl}
            alt={recipe.titulo}
            className="w-full h-72 object-cover rounded-2xl shadow-md mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          />
        )}

        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          {recipe.descripcion}
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          <motion.div
            className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 shadow-lg"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            <h2 className="text-2xl font-semibold mb-3">🧂 Ingredientes</h2>
            <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300">
              {recipe.ingredientes.length ? (
                recipe.ingredientes.map((ing, idx) => (
                  <li key={idx}>
                    {ing.nombre} — {ing.cantidad} {ing.unidad}
                  </li>
                ))
              ) : (
                <li>No hay ingredientes.</li>
              )}
            </ul>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 shadow-lg"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            <h2 className="text-2xl font-semibold mb-3">👩‍🍳 Pasos</h2>
            <ol className="space-y-2 list-decimal list-inside text-gray-700 dark:text-gray-300">
              {recipe.pasos.length ? (
                recipe.pasos.map((p, i) => (
                  <li key={i}>
                    {p.descripcion}
                    {p.fotoUrl && (
                      <img
                        src={p.fotoUrl}
                        alt=""
                        className="rounded-lg mt-2 w-64"
                      />
                    )}
                  </li>
                ))
              ) : (
                <li>No hay pasos.</li>
              )}
            </ol>
          </motion.div>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center text-gray-600 dark:text-gray-400 mb-8">
          {recipe.tiempo && (
            <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/50">
              ⏱ {recipe.tiempo}
            </span>
          )}
          {recipe.dificultad && (
            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50">
              📈 {recipe.dificultad}
            </span>
          )}
          {recipe.pais && (
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50">
              🌍 {recipe.pais}
            </span>
          )}
        </div>

        {/* ===== Comentarios ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">
            💬 Comentarios
          </h2>

          {comments.length === 0 ? (
            <p className="text-center text-gray-500">
              Sé el primero en dejar un comentario.
            </p>
          ) : (
            <AnimatePresence>
              {comments.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-3"
                  whileHover={{ scale: 1.02 }}
                >
                  {editingCommentId === c.id ? (
                    <div>
                      <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full p-2 rounded mb-2 bg-gray-50 dark:bg-gray-900"
                      />
                      <div className="flex space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            key={s}
                            onClick={() => setEditCommentRating(s)}
                          >
                            <span
                              className={`text-xl ${
                                s <= editCommentRating
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            >
                              ★
                            </span>
                          </motion.button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleEditSave(c.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span className="font-semibold">{c.usuario}: </span>
                      {c.texto}
                      <motion.span
                        className="ml-2"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        {"★".repeat(c.valoracion || 0)}
                      </motion.span>
                      {String(c.usuario?.id) ===
                        String(localStorage.getItem("userId")) && (
                        <button
                          onClick={() => {
                            setEditingCommentId(c.id);
                            setEditCommentText(c.texto);
                            setEditCommentRating(c.valoracion);
                          }}
                          className="ml-2 text-blue-500 underline"
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isLoggedIn && (
            <form
              onSubmit={handleCommentSubmit}
              className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-inner"
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 rounded mb-2 bg-white dark:bg-gray-900"
                placeholder="Escribe tu comentario..."
              />
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                  >
                    <span
                      className={`text-2xl ${
                        s <= rating ? "text-yellow-400" : "text-gray-400"
                      }`}
                    >
                      ★
                    </span>
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full"
              >
                Enviar comentario
              </motion.button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RecipeDetail;
