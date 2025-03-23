import { Pencil, Power } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { User } from '../../constants';
import { useUsersStore } from '../../store';
import ConfirmationModal from './ConfirmationModal';
import UserModal from './UserModal';

interface UserTableProps {
  isLoading: boolean;
  users: User[];
}

const UserTable = ({ isLoading, users }: UserTableProps) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const toggleUserActivity = useUsersStore((state) => state.toggleUserActivity);

  // Abrir el modal de confirmación para activar/desactivar usuario
  const handleDeactivate = (user: User) => {
    setSelectedUser(user);
    setIsConfirmationModalOpen(true);
  };

  // Confirmar activación/desactivación del usuario
  const confirmDeactivate = async () => {
    if (selectedUser) {
      try {
        const updatedUser = await toggleUserActivity(selectedUser.id);
        toast.success(
          `El usuario ${updatedUser.name} ${updatedUser.lastName} ahora está ${
            updatedUser.isActive ? 'activo' : 'inactivo'
          }.`
        );
      } catch (error) {
        console.error('Error al cambiar el estado del usuario:', error);
        toast.error('Error al cambiar el estado del usuario.');
      } finally {
        setSelectedUser(null);
        setIsConfirmationModalOpen(false);
      }
    }
  };

  // Abrir el modal de edición de usuario
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left">
            <th className="px-3 py-2 border-b dark:border-gray-600">ID</th>
            <th className="px-3 py-2 border-b dark:border-gray-600">Nombre</th>
            <th className="px-3 py-2 border-b dark:border-gray-600">Email</th>
            <th className="px-3 py-2 border-b dark:border-gray-600">
              Teléfono
            </th>
            <th className="px-3 py-2 border-b dark:border-gray-600">Peso</th>
            <th className="px-3 py-2 border-b dark:border-gray-600">Altura</th>
            <th className="px-3 py-2 border-b dark:border-gray-600">
              Fecha Registro
            </th>
            <th className="px-3 py-2 border-b dark:border-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                Cargando...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                No hay usuarios disponibles.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  {user.id}
                </td>
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  {user.name} {user.lastName}
                </td>
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  {user.email}
                </td>
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  {user.phone || 'N/A'}
                </td>
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  {user.weight} kg
                </td>
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  {user.height} m
                </td>
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  {new Date(user.registerDate).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  <div className="flex items-center gap-2 justify-evenly">
                    {/* Botón para activar/desactivar */}
                    <button
                      onClick={() => handleDeactivate(user)}
                      className={`h-5 w-5 rounded-full flex align-middle items-center bg-opacity-70 justify-center ${
                        user.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      <span className="align-middle">
                        <Power />
                      </span>
                    </button>

                    {/* Botón para editar */}
                    <button
                      className="h-5 w-5 flex align-middle items-center justify-center rounded-full"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        title={`Confirmar ${
          selectedUser?.isActive ? 'Desactivación' : 'Activación'
        }`}
        message={`¿Estás seguro de que deseas ${
          selectedUser?.isActive ? 'desactivar' : 'activar'
        } al usuario ${selectedUser?.name} ${selectedUser?.lastName}?`}
        confirmText={`${selectedUser?.isActive ? 'Desactivar' : 'Activar'}`}
        cancelText="Cancelar"
        onConfirm={confirmDeactivate}
        onCancel={() => setIsConfirmationModalOpen(false)}
      />

      {/* Modal para editar usuario */}
      {isEditModalOpen && (
        <UserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser ?? undefined}
        />
      )}
    </div>
  );
};

export default UserTable;
