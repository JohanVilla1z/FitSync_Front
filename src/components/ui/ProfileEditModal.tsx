import { Eye, EyeOff, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User } from '../../constants';
import {
  updateUserPassword,
  updateUserProfile,
} from '../../services/userService';
import { useUserProfileStore } from '../../store';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: User;
}

interface ProfileFormData {
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  height?: number;
  weight?: number;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
}

const ProfileEditModal = ({
  isOpen,
  onClose,
  profile,
}: ProfileEditModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { fetchUserProfile } = useUserProfileStore();

  const defaultValues: ProfileFormData = {
    name: profile.name || '',
    lastName: profile.lastName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    height: profile.height,
    weight: profile.weight,
    currentPassword: '',
    password: '',
    confirmPassword: '',
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues,
  });

  const password = watch('password');

  useEffect(() => {
    if (profile && isOpen) {
      reset({
        name: profile.name || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        height: profile.height,
        weight: profile.weight,
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
      setActiveTab('profile');
    }
  }, [profile, reset, isOpen]);

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const { currentPassword, password, confirmPassword, ...profileData } =
        data;

      await updateUserProfile(profileData);
      await fetchUserProfile();

      toast.success('Perfil actualizado correctamente');
      onClose();
    } catch (error: any) {
      console.error(
        'Error al actualizar el perfil:',
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || 'Error al actualizar el perfil'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitPassword = async (data: ProfileFormData) => {
    if (!data.currentPassword || !data.password) return;

    setIsSubmitting(true);
    try {
      // Llamar al servicio para actualizar la contraseña
      await updateUserPassword(data.currentPassword, data.password);

      toast.success('Contraseña actualizada correctamente');
      onClose();
    } catch (error: any) {
      console.error(
        'Error al actualizar la contraseña:',
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || 'Error al actualizar la contraseña'
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
          <h2 className="text-xl font-bold">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 ${
              activeTab === 'profile'
                ? 'border-b-2 border-blue-500 font-medium text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('profile')}
            type="button"
          >
            Datos personales
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'password'
                ? 'border-b-2 border-blue-500 font-medium text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('password')}
            type="button"
          >
            Cambiar contraseña
          </button>
        </div>

        {activeTab === 'profile' ? (
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
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
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.name.message}
                </p>
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
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Teléfono{' '}
                <span className="text-gray-500 text-xs">(opcional)</span>
              </label>
              <input
                {...register('phone')} // Sin validación obligatoria
                id="phone"
                type="text"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Dejar en blanco si no deseas proporcionar"
              />
            </div>

            {/* Peso */}
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium mb-1"
              >
                Peso (kg)
              </label>
              <input
                {...register('weight', {
                  valueAsNumber: true,
                  min: {
                    value: 20,
                    message: 'El peso debe ser al menos 20 kg',
                  },
                  max: {
                    value: 300,
                    message: 'El peso no puede ser mayor a 300 kg',
                  },
                })}
                id="weight"
                type="number"
                step="0.1"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.weight && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.weight.message}
                </p>
              )}
            </div>

            {/* Altura */}
            <div>
              <label
                htmlFor="height"
                className="block text-sm font-medium mb-1"
              >
                Altura (m)
              </label>
              <input
                {...register('height', {
                  valueAsNumber: true,
                  min: {
                    value: 0.5,
                    message: 'La altura debe ser al menos 0.5 m',
                  },
                  max: {
                    value: 2.5,
                    message: 'La altura no puede ser mayor a 2.5 m',
                  },
                })}
                id="height"
                type="number"
                step="0.01"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.height && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.height.message}
                </p>
              )}
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
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
            {/* Contraseña actual */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium mb-1"
              >
                Contraseña actual
              </label>
              <div className="relative">
                <input
                  {...register('currentPassword', {
                    required: 'La contraseña actual es obligatoria',
                  })}
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* Nueva contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'La nueva contraseña es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres',
                    },
                  })}
                  id="password"
                  type={showNewPassword ? 'text' : 'password'}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Confirma tu nueva contraseña',
                    validate: (value) =>
                      value === password || 'Las contraseñas no coinciden',
                  })}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
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
                {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileEditModal;
