# FitSync Frontend 🏋️‍♀️

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-4.x-orange)](https://github.com/pmndrs/zustand)

**FitSync** es una aplicación web moderna diseñada para la gestión integral de gimnasios y el seguimiento del progreso fitness de los usuarios. Construida con tecnologías de vanguardia como React, TypeScript y Vite, ofrece una experiencia de usuario fluida y eficiente.

## Tabla de Contenidos

- [FitSync Frontend 🏋️‍♀️](#fitsync-frontend-️‍♀️)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Características Principales](#características-principales)
  - [Stack Tecnológico](#stack-tecnológico)
  - [Primeros Pasos](#primeros-pasos)
    - [Prerrequisitos](#prerrequisitos)
    - [Instalación](#instalación)
    - [Scripts Disponibles](#scripts-disponibles)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Arquitectura](#arquitectura)
  - [Flujo de Uso Típico](#flujo-de-uso-típico)
  - [Configuración](#configuración)
    - [Variables de Entorno](#variables-de-entorno)
  - [Conexión con API (Backend Spring Boot)](#conexión-con-api-backend-spring-boot)
    - [Instancia de Axios](#instancia-de-axios)
    - [Manejo de Autenticación](#manejo-de-autenticación)
    - [Manejo de Errores](#manejo-de-errores)
  - [Consideraciones de Seguridad](#consideraciones-de-seguridad)
  - [Despliegue](#despliegue)
  - [Contribución](#contribución)
  - [Licencia](#licencia)

## Características Principales

- **Gestión de Equipamiento:** 🏋️ Seguimiento del estado (disponible, prestado, no disponible) y historial de préstamos del equipamiento del gimnasio.
- **Gestión de Usuarios y Entrenadores:** 👥 Administración de perfiles, roles (Admin, Trainer, User) y asignación de entrenadores a usuarios.
- **Seguimiento de Progreso:** 📊 Cálculo de IMC, registro de peso y altura.
- **Registro de Entradas:** 🚪 Sistema para que los usuarios registren su asistencia al gimnasio.
- **Dashboard de Estadísticas:** 📈 Visualización de métricas clave como usuarios activos, entradas diarias y tasa de retención.
- **Autenticación y Autorización:** 🔒 Sistema seguro basado en JWT con control de acceso por roles.
- **Interfaz Moderna:** ✨ Diseño limpio y responsive con soporte para modo claro y oscuro, construido con TailwindCSS.
- **Gestión de Estado Eficiente:** 🐻 Uso de Zustand para un manejo de estado global simple y potente.

## Stack Tecnológico

- **Framework Frontend:** React 19
- **Lenguaje:** TypeScript
- **Bundler:** Vite
- **Estilos:** TailwindCSS
- **Gestión de Estado:** Zustand
- **Routing:** React Router
- **Peticiones HTTP:** Axios
- **Notificaciones:** React Toastify
- **Iconos:** Lucide React

## Primeros Pasos

### Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

- Node.js (v18 o superior)
- npm, yarn o pnpm (se recomienda npm o pnpm)

### Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/yourusername/fitsync-front.git
    cd fitsync-front
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    # o
    # yarn install
    # o
    # pnpm install
    ```

### Scripts Disponibles

- **Iniciar servidor de desarrollo:**

  ```bash
  npm run dev
  ```

  Abre la aplicación en modo desarrollo en `http://localhost:5173` (o el puerto que indique Vite).

- **Crear build de producción:**

  ```bash
  npm run build
  ```

  Genera los archivos optimizados para producción en la carpeta `dist/`.

- **Vista previa del build de producción:**

  ```bash
  npm run preview
  ```

  Inicia un servidor local para previsualizar el build de producción.

- **Linting y Formateo:**
  ```bash
  npm run lint # Ejecuta ESLint
  npm run format # Ejecuta Prettier
  ```

## Estructura del Proyecto

```bash
src/
├── api/         # Configuración de API
├── components/  # Componentes React
├── constants/   # Definiciones de tipos y constantes
├── pages/       # Componentes de páginas
├── store/       # Gestión de estado
├── utils/       # Funciones de utilidad
└── assets/      # Recursos estáticos
```

## Conexión con API (Backend Spring Boot)

El frontend de FitSync se conecta a una API RESTful desarrollada con Spring Boot a través de Axios. La configuración centralizada permite una gestión eficiente de las peticiones y el manejo de autenticación.

### Instancia de Axios

La configuración de la conexión se encuentra en `src/api/axiosInstance.ts`:

```typescript
// Instancia centralizada de Axios con interceptores para JWT
import axios from 'axios';
import { useAuthStore } from '../store';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo centralizado de errores (401, 403, etc.)
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

## Contribución

- 1 Haz un fork del proyecto
- 2 Crea tu rama de características (git checkout -b feature/CaracteristicaIncreible)
- 3 Haz commit de tus cambios (git commit -m 'Añadir CaracteristicaIncreible')
- 4 Sube los cambios a tu rama (git push origin feature/CaracteristicaIncreible)
- 5 Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo `LICENSE` para más detalles.
