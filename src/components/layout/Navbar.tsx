import { LogOut, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore, useThemeStore } from "../../store";
import { getHomePageByRole } from "../../utils";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    toast.info("Sesión cerrada correctamente.");
    logout();
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-background shadow-md">
      {/* Logo - Redirige según el rol */}
      <Link
        to={getHomePageByRole(user?.role)}
        className="flex items-center align-middle gap-2 text-xl font-bold text-primary"
      >
        <img
          src={"src/assets/logos/fitsync-logo.png"}
          alt="FitSync"
          className="h-8"
        />
        <p>FitSync</p>
      </Link>

      <div className="flex items-center gap-4">
        {/* Cambio de tema */}
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Avatar - Redirige al perfil */}
        <Link to="/profile">
          <img
            src={`src/assets/avatars/${user?.role}-avatar.png`}
            alt="Avatar"
            className="h-8 w-8 rounded-full "
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

export default Navbar;
