import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User } from '../../../constants/User';
import { Equipment } from '../../../constants/equipment';
import { getAllUsers } from '../../../services/userService';
import { useEquipmentStore } from '../../../store/useEquipmentStore';
import { useLoanStore } from '../../../store/useLoanStore';
import { LoanForm } from './LoanForm';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoanModal = ({ isOpen, onClose }: LoanModalProps) => {
  const { createLoan } = useLoanStore();
  const {
    equipment = [],
    fetchEquipment,
    fetchEquipmentStats,
    isLoading: isLoadingEquipment,
  } = useEquipmentStore();

  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [availableEquipment, setAvailableEquipment] = useState<Equipment[]>([]);

  const { reset } = useForm();

  useEffect(() => {
    async function loadData() {
      if (!isOpen) return;

      try {
        // Aseguramos que los datos de equipos estén actualizados
        await Promise.all([fetchEquipment(), fetchEquipmentStats()]);

        setIsLoadingUsers(true);
        const fetchedUsers = await getAllUsers();
        const activeUsers = fetchedUsers.filter((user) => user.isActive);
        setUsers(activeUsers);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar datos');
      } finally {
        setIsLoadingUsers(false);
      }
    }

    loadData();
  }, [isOpen, fetchEquipment, fetchEquipmentStats]);

  useEffect(() => {
    const availableItems = equipment.filter(
      (item) => item.status === 'AVAILABLE'
    );
    setAvailableEquipment(availableItems);

    if (isOpen && equipment.length > 0 && availableItems.length === 0) {
      toast.info('No hay equipos disponibles para préstamo');
    }
  }, [equipment, isOpen]);

  const handleSubmit = async (data: {
    userId: string;
    equipmentId: string;
  }) => {
    if (!data.userId || !data.equipmentId) {
      toast.error('Seleccione un usuario y un equipo');
      return;
    }

    setIsSubmitting(true);
    try {
      await createLoan(Number(data.userId), Number(data.equipmentId));
      toast.success('Préstamo creado exitosamente');
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating loan:', error);
      toast.error('Error al crear el préstamo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isLoading = isLoadingEquipment || isLoadingUsers;

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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Cargando información...
            </p>
          </div>
        ) : availableEquipment.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              No hay equipos disponibles para préstamo en este momento.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <LoanForm
            users={users}
            equipment={availableEquipment}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default LoanModal;
