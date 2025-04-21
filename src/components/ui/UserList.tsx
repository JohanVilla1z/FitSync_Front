import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useUsersStore } from '../../store/useUsersStore';
import UserModal from './UserModal';
import UserTable from './UserTable';

const UserList = () => {
  const {
    filteredUsers,
    isLoading,
    error,
    fetchUsers,
    setSearchQuery,
    searchQuery,
  } = useUsersStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) {
    return <div className="text-center py-10">Cargando usuarios...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error al cargar usuarios: {error}
      </div>
    );
  }

  return (
    <div>
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Lista de Usuarios</h2>
        {/* Barra de búsqueda */}
        <div className="relative w-full md:w-1/4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      <UserTable users={filteredUsers} />

      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default UserList;
