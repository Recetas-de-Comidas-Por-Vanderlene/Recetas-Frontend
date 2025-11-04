# 🍳 Vuelta al Mundo: Recetas App

Una aplicación web para compartir y descubrir recetas de diferentes países. Construida con React y diseñada con un enfoque minimalista y moderno.

## 📌 Índice
- [Tecnologías](#-tech-stack)
- [Características](#-características) 
- [Instalación](#️-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts](#-scripts)
- [API Endpoints](#-api-endpoints)
- [Contribución](#-contribución)
- [Autor](#-autor)
- [Licencia](#-licencia)

## ⚡ Tech Stack

![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat)
![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white&style=flat)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat)
![React Router](https://img.shields.io/badge/-React%20Router-CA4245?logo=react-router&logoColor=white&style=flat)



## 🚀 Características

- 🔐 Autenticación de usuarios
  - Login con email/password
  - Login con Google

- 📝 CRUD completo de recetas
  - Creación con editor 
  - Subida de imágenes
  - Tiempo de preparación
  - Nivel de dificultad
- 🌍 Filtrado por:
  - País
  - Categoría
  - Ingredientes
  - Tiempo de preparación
- ⭐ Sistema de valoraciones y favoritos
- 💬 Comentarios en recetas
- 🌓 Modo claro/oscuro
- 📱 Diseño responsive


## 🛠️ Instalación

```bash
# Clonar repositorio
git clone https://github.com/username/vuelta-al-mundo.git

# Entrar al directorio
cd vuelta-al-mundo

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

## 📂 Estructura del Proyecto

```
src/
├── assets/          # Imágenes, fuentes, etc
├── components/      # Componentes reutilizables
├── contexts/        # Contextos de React
├── hooks/          # Custom hooks
├── layouts/        # Componentes de layout
├── pages/          # Componentes de página
├── services/       # Servicios de API
├── store/          # Configuración de Redux
├── styles/         # Estilos globales
└── utils/          # Funciones utilitarias
```

## 📦 Scripts

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Genera build de producción
- `npm run lint` - Ejecuta ESLint
- `npm run preview` - Vista previa de build
- `npm run test` - Ejecuta tests
- `npm run e2e` - Ejecuta tests end-to-end

## 🌐 API Endpoints

La aplicación se conecta a una API REST en `http://localhost:8080/api/` con los siguientes endpoints:

### Autenticación
- `POST /auth/login` - Inicio de sesión
- `POST /auth/register` - Registro de usuario


### Recetas
- `GET /recipes` - Listar recetas
- `GET /recipes/:id` - Obtener receta
- `POST /recipes` - Crear receta
- `PUT /recipes/:id` - Actualizar receta
- `DELETE /recipes/:id` - Eliminar receta


## 🤝 Contribución

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👩‍💻 Autor

**Vanderlene Oliveira**

[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0A66C2?logo=linkedin&logoColor=white&style=flat)](https://linkedin.com/in/vanderleneo)
[![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white&style=flat)](https://github.com/vanderleneo)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
