import {
  Dumbbell,
  Home,
  LogOut,
  Menu,
  Users,
  UserSearch,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Role } from '../../constants/RolEnum';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';
import { useSidebarStore } from '../../store/useSideBarStore';

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const { user, logout } = useAuthStore();

  if (!user || (user.role !== Role.ADMIN && user.role !== Role.TRAINER)) {
    return null;
  }

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/trainers', label: 'Entrenadores', icon: Users },
    { to: '/equipment', label: 'Equipos', icon: Dumbbell },
    { to: '/users', label: 'Usuarios', icon: UserSearch },
  ];

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 min-h-screen bg-gray-900 text-white transition-width duration-300',
        'dark:bg-background-dark dark:text-gray-200 ', // Clases para tema oscuro
        isCollapsed ? 'w-14' : 'w-64'
      )}
    >
      <nav className="mt-4 ">
        <div className="flex items-center justify-between p-4 pb-5 pt-2">
          <button onClick={toggleSidebar} className="text-white">
            {isCollapsed ? <Menu /> : <X />}
          </button>
        </div>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center p-4 space-x-3 transition',
                isActive ? 'bg-gray-700' : 'hover:bg-gray-800'
              )
            }
          >
            <Icon />
            {!isCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="absolute bottom-4 left-4 flex items-center space-x-2"
      >
        <LogOut />
        {!isCollapsed && <span>Cerrar sesión</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
