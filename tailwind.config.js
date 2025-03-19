/**@type {import('tailwindcss').Config}*/
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta de colores principal
        primary: {
          DEFAULT: "#1a202c", // Azul oscuro
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#e2e8f0", // Gris claro
          foreground: "#1a202c",
        },
        destructive: {
          DEFAULT: "#ef4444", // Rojo
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9", // Gris muy claro
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#3b82f6", // Azul
          foreground: "#ffffff",
        },
        background: "#ffffff",
        foreground: "#1a202c",
        card: "#ffffff",
        "card-foreground": "#1a202c",
        border: "#e2e8f0",
        input: "#e2e8f0",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [], // Remove the tailwindcss-animate plugin
  darkMode: "class", // Habilita el modo oscuro con la clase 'dark'
  theme: {
    extend: {
      colors: {
        background: "#ffffff", // Fondo claro
        "background-dark": "#1a202c", // Fondo oscuro
        foreground: "#1a202c", // Texto claro
        "foreground-dark": "#ffffff", // Texto oscuro
        card: "#ffffff", // Fondo de tarjetas claro
        "card-dark": "#2d3748", // Fondo de tarjetas oscuro
        primary: {
          DEFAULT: "#1a202c", // Azul oscuro
          dark: "#2563eb", // Azul oscuro para tema oscuro
        },
        muted: {
          DEFAULT: "#f1f5f9", // Gris claro
          dark: "#4a5568", // Gris oscuro
        },
      },
    },
  },
};
