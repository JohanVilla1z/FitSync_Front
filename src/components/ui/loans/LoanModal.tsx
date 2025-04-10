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
          console.error('Error loading users:', error); // Log del error específico
          toast.error('Error al cargar usuarios');
        });
    }
  }, [isOpen, fetchEquipment]);

  // También puedes verificar los equipos:
  useEffect(() => {
    if (equipment) {
      console.log('Available equipment:', equipment); // Log de equipos
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Crear Préstamo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

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
