import { X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Trainer } from '../../constants';
import { useTrainersStore } from '../../store/useTrainersStore';

interface TrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer?: Trainer; // Si se pasa un entrenador, es para editar; si no, es para crear
}

const TrainerModal = ({ isOpen, onClose, trainer }: TrainerModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTrainer, updateTrainer } = useTrainersStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Trainer>({
    defaultValues: trainer || {
      name: '',
      email: '',
      password: '',
      active: true, // Inicializar como activo por defecto
      userIds: [],
    },
  });

  const onSubmit = async (data: Trainer) => {
    setIsSubmitting(true);
    try {
      if (trainer) {
        // Editar entrenador existente
        await updateTrainer(data);
        toast.success(`Entrenador "${data.name}" actualizado exitosamente`);
      } else {
        // Crear nuevo entrenador
        await createTrainer(data);
        toast.success(`Entrenador "${data.name}" creado exitosamente`);
      }
      reset();
      onClose();
    } catch (error) {
      console.error('Error al guardar el entrenador:', error);
      toast.error('Error al guardar el entrenador.');
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
            {trainer ? 'Editar Entrenador' : 'Crear Entrenador'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
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
              placeholder="Nombre del entrenador"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              {...register('email', {
                required: 'El correo electrónico es obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Ingresa un correo electrónico válido',
                },
              })}
              id="email"
              type="email"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="correo@ejemplo.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contraseña */}
          {!trainer && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Contraseña
              </label>
              <input
                {...register('password', {
                  required: 'La contraseña es obligatoria',
                })}
                id="password"
                type="password"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Contraseña"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          {/* Activo */}
          <div>
            <label htmlFor="active" className="block text-sm font-medium mb-1">
              Activo
            </label>
            <input
              {...register('active')}
              id="active"
              type="checkbox"
              className="mr-2"
              defaultChecked={trainer?.active} // Asegurarse de que el valor inicial sea correcto
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerModal;
