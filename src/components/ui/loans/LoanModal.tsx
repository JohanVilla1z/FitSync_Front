import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User } from '../../../constants/User';
import { getTrainerUsers } from '../../../services/trainerService';
import { useEquipmentStore } from '../../../store/useEquipmentStore';
import { useLoanStore } from '../../../store/useLoanStore';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerId: number; // ID del entrenador para obtener usuarios
}

const LoanModal = ({ isOpen, onClose, trainerId }: LoanModalProps) => {
  const { createLoan } = useLoanStore();
  const { equipment, fetchEquipment } = useEquipmentStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userId: '',
      equipmentId: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchEquipment(); // Cargar equipos disponibles
      getTrainerUsers(trainerId).then(setUsers); // Cargar usuarios activos del entrenador
    }
  }, [isOpen, fetchEquipment, trainerId]);

  const onSubmit = async (data: { userId: string; equipmentId: string }) => {
    setIsSubmitting(true);
    try {
      await createLoan(Number(data.userId), Number(data.equipmentId));
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
        <h2 className="text-xl font-bold mb-4">Crear Préstamo</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Selección de usuario */}
          <div>
            <label htmlFor="userId" className="block text-sm font-medium mb-1">
              Usuario
            </label>
            <select
              {...register('userId', { required: 'Selecciona un usuario' })}
              id="userId"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.lastName}
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="text-sm text-red-600 mt-1">
                {errors.userId.message}
              </p>
            )}
          </div>

          {/* Selección de equipo */}
          <div>
            <label
              htmlFor="equipmentId"
              className="block text-sm font-medium mb-1"
            >
              Equipo
            </label>
            <select
              {...register('equipmentId', { required: 'Selecciona un equipo' })}
              id="equipmentId"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Selecciona un equipo</option>
              {equipment
                .filter((item) => item.available)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
            {errors.equipmentId && (
              <p className="text-sm text-red-600 mt-1">
                {errors.equipmentId.message}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
            >
              {isSubmitting ? 'Creando...' : 'Crear Préstamo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanModal;
