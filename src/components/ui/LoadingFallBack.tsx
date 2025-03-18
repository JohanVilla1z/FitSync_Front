interface LoadingFallbackProps {
  /**
   * Tamaño del spinner: 'sm', 'md', 'lg'
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  /**
   * Altura del contenedor
   * @default 'h-screen'
   */
  height?: string;

  /**
   * Mostrar con fondo semi-transparente
   * @default false
   */
  overlay?: boolean;
}

/**
 * Componente de carga que se muestra durante la carga diferida (lazy loading)
 */
const LoadingFallback = ({
  size = "md",
  height = "h-screen",
  overlay = false,
}: LoadingFallbackProps) => {
  // Determinar tamaño del spinner
  const spinnerSize =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-16 w-16" : "h-12 w-12";

  // Determinar si debe tener fondo con efecto blur
  const bgClass = overlay ? "bg-background/80 backdrop-blur-sm" : "";

  return (
    <div className={`flex justify-center items-center ${height} ${bgClass}`}>
      <div
        className={`animate-spin rounded-full ${spinnerSize} border-b-2 border-primary`}
      ></div>
    </div>
  );
};

export default LoadingFallback;
