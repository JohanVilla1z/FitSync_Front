import { useEffect } from 'react';
import UserTable from './UserTable';
import { useUsersStore } from '../../store';

const UserList = () => {
  const { isLoading, filteredUsers, fetchUsersIfNeeded, setSearchQuery } =
    useUsersStore();

  useEffect(() => {
    // Cargar usuarios solo si es necesario
    fetchUsersIfNeeded();
  }, [fetchUsersIfNeeded]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Lista de Usuarios</h2>
        <input
          type="text"
          placeholder="Buscar usuario..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-full sm:w-64 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>
      <UserTable isLoading={isLoading} users={filteredUsers} />
    </div>
  );
};

export default UserList;
