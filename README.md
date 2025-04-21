# FitSync Frontend

Una aplicación moderna de seguimiento fitness y gestión de gimnasios construida con React, TypeScript y Vite.

## Características

- 🏋️ Seguimiento y gestión de equipamiento
- 👥 Perfiles de usuarios y entrenadores
- 📊 Estadísticas de fitness y seguimiento de progreso
- 🌓 Soporte para modo claro/oscuro
- 🔒 Autenticación basada en roles
- 📱 Diseño responsive

## Stack Tecnológico

- React 19
- TypeScript
- Vite
- TailwindCSS
- Zustand (Gestión de Estado)
- React Router
- Axios

## Primeros Pasos

### Prerrequisitos

- Node.js 18+
- npm/yarn/pnpm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/yourusername/fitsync-front.git

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Crear build de producción
npm run build

# Vista previa del build de producción
npm run preview

# Estructura del proyecto
src/
├── api/         # Configuración de API
├── components/  # Componentes React
├── constants/   # Definiciones de tipos y constantes
├── pages/       # Componentes de páginas
├── store/       # Gestión de estado
├── utils/       # Funciones de utilidad
└── assets/      # Recursos estáticos
```

## Conexión con API (Spring Boot)

El frontend de FitSync se conecta a una API RESTful desarrollada con Spring Boot a través de Axios. La configuración centralizada permite una gestión eficiente de las peticiones y el manejo de autenticación.

### Configuración de la API

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

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
