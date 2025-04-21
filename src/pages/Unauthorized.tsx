import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark">
      <h1 className="text-6xl font-bold mb-4">403</h1>
      <p className="text-xl text-muted-foreground dark:text-muted-dark mb-8">
        No tienes permiso para acceder a esta página.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 dark:bg-primary-dark dark:hover:bg-primary/80"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default Unauthorized;
