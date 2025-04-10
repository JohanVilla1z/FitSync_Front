import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User } from '../../../constants/User';
import { getAllUsers } from '../../../services/userService';
import { useEquipmentStore } from '../../../store/useEquipmentStore';
import { useLoanStore } from '../../../store/useLoanStore';
import { LoanForm } from './LoanForm';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoanModal = ({ isOpen, onClose }: LoanModalProps) => {
  const loanStore = useLoanStore();
  const equipmentStore = useEquipmentStore();

  if (!loanStore || !equipmentStore) {
    console.error('Stores are not initialized properly.');
    return null;
  }

  const { createLoan } = loanStore;
  const { equipment = [], fetchEquipment } = equipmentStore;

  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { reset } = useForm();

  useEffect(() => {
    if (isOpen) {
      fetchEquipment?.();
      getAllUsers()
        .then((fetchedUsers) => {
          const activeUsers = fetchedUsers.filter((user) => user.isActive);
          setUsers(activeUsers);
        })
        .catch((error) => {
          console.error('Error loading users:', error);
          toast.error('Error al cargar usuarios');
        });
    }
  }, [isOpen, fetchEquipment]);

  useEffect(() => {
    if (equipment) {
      console.log('Available equipment:', equipment);
    }
  }, [equipment]);

  const handleSubmit = async (data: {
    userId: string;
    equipmentId: string;
  }) => {
    setIsSubmitting(true);
    try {
      await createLoan?.(Number(data.userId), Number(data.equipmentId));
      toast.success('Préstamo creado exitosamente');
      reset();
      onClose();
    } catch (error) {
      toast.error('Error al crear el préstamo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loan-modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md"
        role="document"
      >
        <header className="flex justify-between items-center mb-4">
          <h2
            id="loan-modal-title"
            className="text-xl font-bold text-gray-900 dark:text-gray-100"
          >
            Crear Préstamo
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </header>

        <LoanForm
          users={users}
          equipment={equipment}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default LoanModal;
