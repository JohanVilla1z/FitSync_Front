import { LogOut, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import fitsyncLogo from '../../assets/logos/fitsync-logo.png';
import { Role } from '../../constants';
import { useAuthStore, useThemeStore } from '../../store';
import { getAvatarByRole, getHomePageByRole } from '../../utils';

const NavBar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    toast.info('Sesión cerrada correctamente.');
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-background shadow-md bg-background-dark text-white">
      {/* Logo - Redirige según el rol */}
      <Link
        to={getHomePageByRole(user?.role ?? Role.USER)}
        className="flex items-center align-middle pl-14 gap-2 text-xl font-bold text-primary"
      >
        <img src={fitsyncLogo} alt="FitSync" className="h-8" />
        <p className="text-white">FitSync</p>
      </Link>

      <div className="flex items-center gap-4">
        {/* Cambio de tema */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted dark:hover:bg-muted-dark"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Avatar - Redirige al perfil */}
        <Link to="/profile">
          <img
            src={getAvatarByRole(user?.role)}
            alt="Avatar"
            className="h-8 w-8 p-0.5 rounded-full bg-white"
          />
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-muted"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
