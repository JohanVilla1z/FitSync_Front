import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Equipment } from '../../constants/equipment';
import { useEquipmentStore } from '../../store/useEquipmentStore';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment?: Equipment; // Si se pasa un equipo, es para editar; si no, es para crear
}

const EquipmentModal = ({
  isOpen,
  onClose,
  equipment,
}: EquipmentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createEquipment, updateEquipment } = useEquipmentStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Equipment>({
    defaultValues: equipment || {
      id: 0,
      name: '',
      description: '',
      available: true,
      currentLoans: 0,
    },
  });

  const onSubmit = async (data: Equipment) => {
    setIsSubmitting(true);
    try {
      if (equipment) {
        await updateEquipment(data);
        toast.success(`Equipo ${data.name} actualizado exitosamente`);
      } else {
        await createEquipment(data);
        toast.success(`Equipo ${data.name} creado exitosamente`);
      }
      reset();
      onClose();
    } catch (error) {
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

          {/* Disponible */}
          <div>
            <label
              htmlFor="available"
              className="block text-sm font-medium mb-1"
            >
              Disponible
            </label>
            <input
              {...register('available')}
              id="available"
              type="checkbox"
              className="mr-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                toast.info('Edición cancelada');
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
