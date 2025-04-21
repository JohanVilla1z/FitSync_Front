import { RefreshCw, UserX } from 'lucide-react';
import { toast } from 'react-toastify';
import { Spinner } from '..';
import { User } from '../../../constants/User';

interface TrainerUsersListProps {
  users: User[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

const TrainerUsersList = ({
  users,
  isLoading,
  onRefresh,
}: TrainerUsersListProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sin registros';

    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  const handleRefresh = async () => {
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error al actualizar la lista de usuarios:', error);
      toast.error('No se pudo actualizar la lista de usuarios');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <Spinner className="h-8 w-8 mx-auto" />
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Cargando usuarios...
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-10 flex flex-col items-center">
        <UserX className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          No tienes usuarios asignados actualmente
        </p>
        <button
          onClick={handleRefresh}
          className="mt-2 inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Actualizar lista
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={handleRefresh}
          className="inline-flex items-center text-sm px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Actualizar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                IMC
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Registro
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium">
                    {user.name} {user.lastName || ''}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm">{user.email}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                      user.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {user.currentIMC && !isNaN(user.currentIMC)
                    ? user.currentIMC.toFixed(1)
                    : 'No disponible'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {formatDate(user.registerDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainerUsersList;
