/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fondo principal
        background: '#ffffff', // Fondo claro
        'background-dark': '#1a202c', // Fondo oscuro

        // Texto principal
        foreground: '#1a202c', // Texto oscuro para tema claro
        'foreground-dark': '#ffffff', // Texto claro para tema oscuro

        // Texto secundario (muted)
        muted: {
          DEFAULT: '#6b7280', // Gris oscuro para tema claro
          dark: '#9ca3af', // Gris claro para tema oscuro
        },

        // Fondo de tarjetas
        card: '#ffffff', // Fondo de tarjetas claro
        'card-dark': '#2d3748', // Fondo de tarjetas oscuro

        // Colores primarios
        primary: {
          DEFAULT: '#2563eb', // Azul para tema claro
          dark: '#3b82f6', // Azul más claro para tema oscuro
        },

        // Colores secundarios
        secondary: {
          DEFAULT: '#e2e8f0', // Gris claro
          foreground: '#1a202c', // Texto oscuro para tema claro
        },

        // Colores destructivos (errores)
        destructive: {
          DEFAULT: '#ef4444', // Rojo
          foreground: '#ffffff', // Texto blanco sobre rojo
        },

        // Colores de acento
        accent: {
          DEFAULT: '#3b82f6', // Azul
          foreground: '#ffffff', // Texto blanco sobre azul
        },

        // Bordes e inputs
        border: '#e2e8f0', // Gris claro para bordes
        input: '#e2e8f0', // Fondo de inputs
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  darkMode: 'class', // Habilita el modo oscuro con la clase 'dark'
  plugins: [],
};
