import { UserPlus, Users as UsersIcon } from 'lucide-react';
import { useState } from 'react';
import UserList from '../../components/ui/UserList';
import UserModal from '../../components/ui/UserModal';

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      {/* Estadísticas rápidas */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total Usuarios
          </h3>
          <p className="text-2xl font-bold">358</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Usuarios Activos
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            245
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Usuarios Inactivos
          </h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            113
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Con Entrenador
          </h3>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            187
          </p>
        </div>
      </section>

      <section>
        <UserList />
      </section>

      {/* Modal para crear usuarios */}
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Users;
