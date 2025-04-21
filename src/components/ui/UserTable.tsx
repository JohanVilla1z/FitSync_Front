import { toast } from 'react-toastify';
import { User } from '../../constants/User';
import { useUsersStore } from '../../store/useUsersStore';
import UserActions from './UserActions';

interface UserTableProps {
  users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
  const { toggleUserActivity } = useUsersStore();

  const handleToggleStatus = async (userId: number) => {
    try {
      await toggleUserActivity(userId);
      toast.success('Estado del usuario actualizado correctamente');
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
      toast.error('No se pudo actualizar el estado del usuario');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Contacto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Medidas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Entrenador
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {users.map((user) => (
            <tr key={user.email}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Desde {new Date(user.registerDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {user.email}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user.phone || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {user.height} cm / {user.weight} kg
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  IMC: {user.currentIMC?.toFixed(1) || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {user.trainerName || 'Sin asignar'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UserActions
                  user={user}
                  onToggleStatus={() => handleToggleStatus(user.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No se encontraron usuarios.
        </div>
      )}
    </div>
  );
};

export default UserTable;
