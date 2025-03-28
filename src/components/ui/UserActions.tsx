import { Edit, User as UserIcon, UserPlus, UserX } from 'lucide-react';
import { useState } from 'react';
import { User } from '../../constants/User';
import AssignTrainerModal from './AssignTrainerModal';
import UserModal from './UserModal';

interface UserActionsProps {
  user: User;
  onEdit?: () => void;
  onToggleStatus?: () => void;
}

const UserActions = ({ user, onEdit, onToggleStatus }: UserActionsProps) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
          onClick={onToggleStatus}
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
    </>
  );
};

export default UserActions;
