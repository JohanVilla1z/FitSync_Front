import { X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User } from '../../constants';
import RegisterForm from '../../constants/auth/registerForm';
import { registerUser } from '../../services/authService';
import { useUsersStore } from '../../store';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User; // Si se pasa un usuario, es para editar; si no, es para crear
}

interface ExtendedUser extends User {
  password?: string; // Contraseña solo para creación
  confirmPassword?: string; // Confirmación de contraseña solo para creación
}

const UserModal = ({ isOpen, onClose, user }: UserModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUser } = useUsersStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExtendedUser>({
    defaultValues: user || {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      weight: 0,
      height: 0,
      isActive: true,
    },
  });

  const password = watch('password'); // Observar el campo de contraseña para validación

  const onSubmit = async (data: ExtendedUser) => {
    setIsSubmitting(true);
    try {
      if (user) {
        // Editar usuario existente
        await updateUser(data);
        toast.success(
          `Usuario "${data.name} ${data.lastName}" actualizado exitosamente`
        );
      } else {
        // Crear nuevo usuario
        const { confirmPassword, isActive, phone, height, weight, ...rest } =
          data;

        // Transformar los datos para que coincidan con RegisterForm
        const newUserData: RegisterForm = {
          ...rest,
          password: data.password || '', // Asegurarse de que la contraseña esté presente
          userHeight: height || 0, // Mapear height a userHeight
          userWeight: weight || 0, // Mapear weight a userWeight
        };

        await registerUser(newUserData); // Usar el servicio de registro
        toast.success(
          `Usuario "${data.name} ${data.lastName}" creado exitosamente`
        );
      }
      reset();
      onClose();
    } catch (error: any) {
      console.error(
        'Error al guardar el usuario:',
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || 'Error al guardar el usuario.'
      );
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
              placeholder="Nombre del usuario"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1"
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

          {/* Contraseña (solo para creación) */}
          {!user && (
            <>
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
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres',
                    },
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1"
                >
                  Confirmar Contraseña
                </label>
                <input
                  {...register('confirmPassword', {
                    required: 'La confirmación de contraseña es obligatoria',
                    validate: (value) =>
                      value === password || 'Las contraseñas no coinciden',
                  })}
                  id="confirmPassword"
                  type="password"
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Confirmar Contraseña"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Teléfono */}
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

          {/* Peso */}
          <div>
            <label htmlFor="weight" className="block text-sm font-medium mb-1">
              Peso (kg)
            </label>
            <input
              {...register('weight', { valueAsNumber: true })}
              id="weight"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="Peso en kilogramos"
            />
          </div>

          {/* Altura */}
          <div>
            <label htmlFor="height" className="block text-sm font-medium mb-1">
              Altura (m)
            </label>
            <input
              {...register('height', { valueAsNumber: true })}
              id="height"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="Altura en metros"
            />
          </div>

          {/* Activo */}
          <div>
            <label
              htmlFor="isActive"
              className="block text-sm font-medium mb-1"
            >
              Activo
            </label>
            <input
              {...register('isActive')}
              id="isActive"
              type="checkbox"
              className="mr-2"
              defaultChecked={user?.isActive}
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

export default UserModal;
