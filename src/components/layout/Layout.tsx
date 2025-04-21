import { useEffect } from 'react';
import NavBar from './NavBar';
import Sidebar from './SideBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.title = 'FitSync - Gestión de gimnasio';
  }, []);

  return (
    <div
      className="flex min-h-screen dark:bg-gray-600 dark:text-white transition-colors"
      role="application"
    >
      <aside className="hidden md:block" aria-label="Navegación principal">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 w-full">
        <header className="fixed top-0 left-0 right-0 z-10" role="banner">
          <NavBar />
        </header>
        <main
          className="flex-1 pt-16 sm:pt-20 md:pt-24 lg:pt-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 w-full"
          role="main"
          id="main-content"
          tabIndex={-1}
          aria-label="Contenido principal"
        >
          {children}
        </main>
        <footer
          className="py-4 px-4 sm:px-6 md:px-8 text-center text-sm text-gray-500 dark:text-gray-400"
          role="contentinfo"
        >
          <p>
            © {new Date().getFullYear()} FitSync. Todos los derechos
            reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
