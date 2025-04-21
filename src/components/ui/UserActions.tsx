import { Edit, User as UserIcon, UserPlus, UserX, X } from 'lucide-react';
import { useState } from 'react';
import { User } from '../../constants/User';
import AssignTrainerModal from './AssignTrainerModal';
import UserModal from './UserModal';

interface UserActionsProps {
  user: User;
  onToggleStatus?: () => void;
}

const UserActions = ({ user, onToggleStatus }: UserActionsProps) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleToggleStatusClick = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmToggleStatus = () => {
    if (onToggleStatus) {
      onToggleStatus();
    }
    setIsConfirmModalOpen(false);
  };

  return (
    <>
      <div className="flex space-x-2">
        {/* Botón para asignar entrenador */}
        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          title="Asignar entrenador"
        >
          <UserPlus size={18} className="text-blue-600 dark:text-blue-400" />
        </button>

        {/* Botón para editar usuario */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          title="Editar usuario"
        >
          <Edit size={18} className="text-amber-600 dark:text-amber-400" />
        </button>

        {/* Botón para cambiar estado */}
        <button
          onClick={handleToggleStatusClick}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          title={user.isActive ? 'Desactivar usuario' : 'Activar usuario'}
        >
          {user.isActive ? (
            <UserX size={18} className="text-red-600 dark:text-red-400" />
          ) : (
            <UserIcon
              size={18}
              className="text-green-600 dark:text-green-400"
            />
          )}
        </button>
      </div>

      {/* Modal para asignar entrenador */}
      <AssignTrainerModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        user={user}
      />

      {/* Modal para editar usuario */}
      <UserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />

      {/* Modal de confirmación para activar/desactivar usuario */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Confirmar cambio
              </h2>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                ¿Estás seguro de que deseas{' '}
                <span className="font-medium">
                  {user.isActive ? 'desactivar' : 'activar'}
                </span>{' '}
                a este usuario?
              </p>

              <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                <p className="font-semibold text-gray-800 dark:text-gray-200 break-words">
                  {user.name} {user.lastName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={confirmToggleStatus}
                className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                  user.isActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {user.isActive ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserActions;
