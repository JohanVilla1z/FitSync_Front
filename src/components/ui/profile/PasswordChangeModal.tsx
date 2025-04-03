import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosInstance from '../../../api/axiosInstance';
import { Spinner } from '../Spinner';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordChangeModal = ({
  isOpen,
  onClose,
  userId,
}: PasswordChangeModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>();

  const newPassword = watch('newPassword');

  const onSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.put(`/user/update-password`, {
        userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success('Contraseña actualizada correctamente');
      reset();
      onClose();
    } catch (error: any) {
      console.error('Error al cambiar la contraseña:', error);
      const errorMessage =
        error.response?.data?.message || 'Error al cambiar la contraseña';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-medium">Cambiar Contraseña</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Contraseña Actual
              </label>
              <input
                type="password"
                {...register('currentPassword', {
                  required: 'La contraseña actual es obligatoria',
                })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                {...register('newPassword', {
                  required: 'La nueva contraseña es obligatoria',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirma tu nueva contraseña',
                  validate: (value) =>
                    value === newPassword || 'Las contraseñas no coinciden',
                })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  <span>Actualizando...</span>
                </>
              ) : (
                'Cambiar Contraseña'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
