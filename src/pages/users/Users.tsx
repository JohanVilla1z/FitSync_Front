import { UserPlus, Users as UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import StatsCards, { StatItem } from '../../components/ui/StatsCards';
import UserList from '../../components/ui/UserList';
import UserModal from '../../components/ui/UserModal';
import { useUsersStore } from '../../store/useUsersStore';

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchUsers, userStats, isLoading } = useUsersStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const statsCards: StatItem[] = [
    {
      title: 'Total Usuarios',
      value: userStats?.total || 0,
      color: 'default' as const,
    },
    {
      title: 'Usuarios Activos',
      value: userStats?.active || 0,
      color: 'green' as const,
    },
    {
      title: 'Usuarios Inactivos',
      value: userStats?.inactive || 0,
      color: 'red' as const,
    },
    {
      title: 'Con Entrenador',
      value: userStats?.withTrainer || 0,
      color: 'amber' as const,
    },
  ];

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <UsersIcon size={28} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold">Usuarios</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Administra la información de los usuarios del gimnasio
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={18} />
          <span>Nuevo Usuario</span>
        </button>
      </header>

      {/* Estadísticas rápidas usando el componente StatsCards */}
      <StatsCards stats={statsCards} isLoading={isLoading} />

      <section>
        <UserList />
      </section>

      {/* Modal para crear usuarios */}
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Users;
