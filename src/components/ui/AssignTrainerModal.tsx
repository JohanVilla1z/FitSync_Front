import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'react-toastify';
import { User } from '../../constants/User';
import { useTrainersStore } from '../../store/useTrainersStore';
import { useUsersStore } from '../../store/useUsersStore';

interface AssignTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

interface FormValues {
  trainerId: number;
}

const AssignTrainerModal = ({
  isOpen,
  onClose,
  user,
}: AssignTrainerModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { assignTrainerToUser } = useUsersStore();
  const { trainers, fetchTrainersIfNeeded } = useTrainersStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (isOpen) {
      fetchTrainersIfNeeded();
    }
  }, [isOpen, fetchTrainersIfNeeded]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await assignTrainerToUser(user.id, Number(data.trainerId));
      toast.success(
        `Entrenador asignado exitosamente a ${user.name} ${user.lastName}`
      );
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error al asignar el entrenador';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Filtrar solo entrenadores activos
  const activeTrainers = trainers.filter((trainer) => trainer.active);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Asignar Entrenador</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <p className="mb-4">
          Asignando entrenador a{' '}
          <span className="font-semibold">
            {user.name} {user.lastName}
          </span>
        </p>

        {user.trainerName && (
          <div className="p-3 mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Este usuario ya tiene asignado a:{' '}
              <strong>{user.trainerName}</strong>. Al asignar un nuevo
              entrenador, se reemplazará el actual.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="trainerId"
              className="block text-sm font-medium mb-1"
            >
              Entrenador
            </label>
            <select
              id="trainerId"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              {...register('trainerId', {
                required: 'Debes seleccionar un entrenador',
              })}
            >
              <option value="">Selecciona un entrenador</option>
              {activeTrainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name}
                </option>
              ))}
            </select>
            {errors.trainerId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.trainerId.message}
              </p>
            )}
          </div>

          {activeTrainers.length === 0 && (
            <p className="text-amber-600 dark:text-amber-400 text-sm">
              No hay entrenadores activos disponibles.
            </p>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || activeTrainers.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTrainerModal;
