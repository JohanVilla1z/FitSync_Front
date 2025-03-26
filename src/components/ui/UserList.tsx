import { useEffect, useState } from 'react';
import { useUsersStore } from '../../store';
import UserModal from './UserModal';
import UserTable from './UserTable';

const UserList = () => {
  const { isLoading, filteredUsers, fetchUsers, setSearchQuery } =
    useUsersStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Lista de Usuarios</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar usuario..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md w-full sm:w-64 dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Crear Usuario
          </button>
        </div>
      </div>
      <UserTable isLoading={isLoading} users={filteredUsers} />
      {isModalOpen && (
        <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default UserList;
