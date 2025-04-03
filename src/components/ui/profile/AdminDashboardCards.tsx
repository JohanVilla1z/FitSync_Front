import {
  BarChart2,
  ChevronRight,
  Dumbbell,
  UserCog,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardCards = () => {
  // Definición de las tarjetas con sus respectivas rutas
  const dashboardCards = [
    {
      title: 'Gestión de Usuarios',
      description:
        'Administra los usuarios del gimnasio, asigna entrenadores y gestiona sus perfiles.',
      icon: <Users size={20} />,
      color: 'blue',
      route: '/users',
    },
    {
      title: 'Gestión de Entrenadores',
      description:
        'Administra al personal de entrenamiento, asigna usuarios y gestiona sus especialidades.',
      icon: <UserCog size={20} />,
      color: 'green',
      route: '/trainers',
    },
    {
      title: 'Dashboard',
      description:
        'Visualiza estadísticas del gimnasio, métricas de rendimiento y datos de uso.',
      icon: <BarChart2 size={20} />,
      color: 'purple',
      route: '/dashboard',
    },
    {
      title: 'Equipamiento',
      description:
        'Gestiona el inventario de equipos, máquinas y materiales del gimnasio.',
      icon: <Dumbbell size={20} />,
      color: 'amber',
      route: '/equipment',
    },
  ];

  // Función para obtener las clases de estilo según el color
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          border: 'border-blue-100 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-300',
          hover: 'hover:bg-blue-100 dark:hover:bg-blue-800/50',
          iconBg: 'bg-blue-100 dark:bg-blue-800',
          iconColor: 'text-blue-600 dark:text-blue-400',
        };
      case 'green':
        return {
          bg: 'bg-green-50 dark:bg-green-900/30',
          border: 'border-green-100 dark:border-green-800',
          text: 'text-green-800 dark:text-green-300',
          hover: 'hover:bg-green-100 dark:hover:bg-green-800/50',
          iconBg: 'bg-green-100 dark:bg-green-800',
          iconColor: 'text-green-600 dark:text-green-400',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/30',
          border: 'border-purple-100 dark:border-purple-800',
          text: 'text-purple-800 dark:text-purple-300',
          hover: 'hover:bg-purple-100 dark:hover:bg-purple-800/50',
          iconBg: 'bg-purple-100 dark:bg-purple-800',
          iconColor: 'text-purple-600 dark:text-purple-400',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/30',
          border: 'border-amber-100 dark:border-amber-800',
          text: 'text-amber-800 dark:text-amber-300',
          hover: 'hover:bg-amber-100 dark:hover:bg-amber-800/50',
          iconBg: 'bg-amber-100 dark:bg-amber-800',
          iconColor: 'text-amber-600 dark:text-amber-400',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          text: 'text-gray-800 dark:text-gray-300',
          hover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
          iconBg: 'bg-gray-100 dark:bg-gray-700',
          iconColor: 'text-gray-600 dark:text-gray-400',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {dashboardCards.map((card, index) => {
        const colorClasses = getColorClasses(card.color);

        return (
          <Link
            key={index}
            to={card.route}
            className={`${colorClasses.bg} ${colorClasses.border} ${colorClasses.hover} p-4 rounded-lg border transition-colors group relative overflow-hidden`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`${colorClasses.iconBg} p-2 rounded-full ${colorClasses.iconColor}`}
              >
                {card.icon}
              </div>
              <h3 className={`font-semibold ${colorClasses.text}`}>
                {card.title}
              </h3>
              <ChevronRight
                size={18}
                className={`${colorClasses.iconColor} ml-auto opacity-0 group-hover:opacity-100 transition-opacity`}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 pl-11">
              {card.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminDashboardCards;
