import { X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User } from '../../constants/User';
import { useUsersStore } from '../../store';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User; // Si se pasa un usuario, es para editar; si no, es para crear
}

const UserModal = ({ isOpen, onClose, user }: UserModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUserInStore } = useUsersStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: user || {
      name: '',
      lastName: '',
      email: '',
      phone: null,
      weight: 0,
      height: 0,
      isActive: true,
      registerDate: new Date().toISOString(),
      currentIMC: null,
      trainerName: null,
    },
  });

  const onSubmit = async (data: User) => {
    setIsSubmitting(true);
    try {
      await updateUserInStore(data);
      toast.success(`Usuario ${data.name} actualizado exitosamente`);
      reset();
      onClose();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      toast.error('Error al actualizar el usuario.');
      onClose();
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
            {user ? 'Editar Usuario' : 'Crear Usuario'}
          </h2>
          <button
            onClick={() => {
              toast.info('Edición cancelada');
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex w-full gap-2">
            <div>
              <label
                htmlFor="name"
                className="w-1/2 block text-sm font-medium mb-1"
              >
                Nombre
              </label>
              <input
                {...register('name', { required: 'El nombre es obligatorio' })}
                id="name"
                type="text"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Nombre del usuario"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="w-1/2 block text-sm font-medium mb-1"
              >
                Apellido
              </label>
              <input
                {...register('lastName', {
                  required: 'El apellido es obligatorio',
                })}
                id="lastName"
                type="text"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Apellido del usuario"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

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

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Teléfono
            </label>
            <input
              {...register('phone')}
              id="phone"
              type="text"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="Teléfono del usuario"
            />
          </div>

          <div className="flex w-full gap-2">
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium mb-1"
              >
                Peso (kg)
              </label>
              <input
                {...register('weight', {
                  required: 'El peso es obligatorio',
                  valueAsNumber: true,
                  min: { value: 1, message: 'El peso debe ser mayor a 0' },
                })}
                id="weight"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Peso en kilogramos"
              />
              {errors.weight && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.weight.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="height"
                className="block text-sm font-medium mb-1"
              >
                Altura (m)
              </label>
              <input
                {...register('height', {
                  required: 'La altura es obligatoria',
                  valueAsNumber: true,
                  min: {
                    value: 0.5,
                    message: 'La altura debe ser mayor a 0.5',
                  },
                  max: {
                    value: 2.5,
                    message: 'La altura no puede ser mayor a 2.5',
                  },
                })}
                id="height"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Altura en metros"
              />
              {errors.height && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.height.message}
                </p>
              )}
            </div>
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

export default UserModal;
