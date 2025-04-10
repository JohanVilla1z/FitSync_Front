import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Equipment,
  EquipmentStatus,
  statusDisplayNames,
} from '../../constants/equipment';
import { useEquipmentStore } from '../../store/useEquipmentStore';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment?: Equipment;
}

const EquipmentModal = ({
  isOpen,
  onClose,
  equipment,
}: EquipmentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createEquipment, updateEquipment } = useEquipmentStore();

  type FormData = {
    name: string;
    description: string;
    status: EquipmentStatus;
    id?: number;
    currentLoans?: number;
    loanCount?: number;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: equipment || {
      name: '',
      description: '',
      status: 'AVAILABLE' as EquipmentStatus,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const equipmentData: Omit<Equipment, 'id'> = {
        name: data.name,
        description: data.description,
        status: data.status,
        currentLoans: equipment?.currentLoans || 0,
        loanCount: equipment?.loanCount || 0,
      };

      if (equipment) {
        await updateEquipment({
          ...equipmentData,
          id: equipment.id,
        });
        toast.success(`Equipo ${data.name} actualizado exitosamente`);
      } else {
        await createEquipment(equipmentData);
        toast.success(`Equipo ${data.name} creado exitosamente`);
      }
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving equipment:', error);
      toast.error('Error al guardar el equipo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {equipment ? 'Editar Equipo' : 'Crear Equipo'}
          </h2>
          <button
            onClick={() => {
              toast.info('Edición cancelada');
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              {...register('name', { required: 'El nombre es obligatorio' })}
              id="name"
              type="text"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="Nombre del equipo"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Descripción
            </label>
            <textarea
              {...register('description', {
                required: 'La descripción es obligatoria',
              })}
              id="description"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="Descripción del equipo"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Estado
            </label>
            <select
              {...register('status', { required: 'El estado es obligatorio' })}
              id="status"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="AVAILABLE">{statusDisplayNames.AVAILABLE}</option>
              <option value="UNAVAILABLE">
                {statusDisplayNames.UNAVAILABLE}
              </option>
              {equipment?.status === 'LOANED' && (
                <option value="LOANED">{statusDisplayNames.LOANED}</option>
              )}
            </select>
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Mostrar contadores si es un equipo existente */}
          {equipment && (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm">
                <span className="font-medium">Préstamos actuales:</span>
                <span className="ml-2">{equipment.currentLoans}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Préstamos totales:</span>
                <span className="ml-2">{equipment.loanCount}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentModal;
