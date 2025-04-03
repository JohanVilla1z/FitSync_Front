import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Spinner } from '..';
import axiosInstance from '../../../api/axiosInstance';
import { Role } from '../../../constants';
import { UserProfile } from '../../../store/useUserProfileStore';
import { useUserProfileStore } from '../../../store';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile; // Cambio de User a UserProfile
  userRole?: string;
}

interface ProfileFormData {
  name: string;
  lastName: string;
  email: string;
  height?: number;
  weight?: number;
  phone?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type TabType = 'profile' | 'password';

const ProfileEditModal = ({
  isOpen,
  onClose,
  profile,
  userRole = Role.USER,
}: ProfileEditModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Usar el store directamente para actualizar el perfil
  const { updateUserProfile } = useUserProfileStore();

  // Convertir altura de metros a centímetros para el formulario
  const heightInCm = profile.height
    ? Math.round(profile.height * 100)
    : undefined;

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: errorsProfile },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: profile.name || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      height: heightInCm,
      weight: profile.weight || undefined,
      phone: profile.phone || undefined,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch,
    formState: { errors: errorsPassword },
  } = useForm<PasswordFormData>();

  const newPassword = watch('newPassword');

  // Resetear el formulario cuando cambie el perfil
  useEffect(() => {
    resetProfile({
      name: profile.name || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      height: heightInCm,
      weight: profile.weight || undefined,
      phone: profile.phone || undefined,
    });
  }, [profile, resetProfile, heightInCm]);

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsSubmittingProfile(true);
    setEmailError(null);

    try {
      console.log('Datos del formulario a enviar:', data);

      // Verificar email único si ha cambiado
      if (data.email !== profile.email) {
        try {
          await axiosInstance.get(`/auth/check-email?email=${data.email}`);
        } catch (error: any) {
          if (error.response?.status === 409) {
            setEmailError('Este correo electrónico ya está en uso');
            setIsSubmittingProfile(false);
            return;
          }
        }
      }

      // Construir objeto de datos a enviar
      const submitData: Record<string, any> = {
        name: data.name?.trim(),
        lastName: data.lastName?.trim(),
        email: data.email?.trim(),
      };

      // Agregar campos específicos para usuarios regulares
      if (userRole === Role.USER) {
        if (data.phone !== undefined) {
          submitData.phone = data.phone?.trim() || null;
        }

        if (data.weight !== undefined && data.weight !== null) {
          submitData.weight = Number(data.weight);
        }

        if (data.height !== undefined && data.height !== null) {
          const heightInMeters = parseFloat(
            (Number(data.height) / 100).toFixed(2)
          );
          submitData.height = heightInMeters;
          console.log('Altura convertida a metros:', heightInMeters);
        }
      }

      console.log('Datos finales a enviar al backend:', submitData);

      // Realizar petición PUT
      const response = await axiosInstance.put<UserProfile>(
        `/profile`,
        submitData
      );
      console.log('Respuesta del servidor:', response.data);

      // Actualizar el perfil en el estado global
      updateUserProfile(response.data);

      toast.success('Perfil actualizado correctamente');
      onClose();
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);

      const errorMessage =
        error.response?.data?.message || 'Error al actualizar el perfil';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsSubmittingPassword(true);

    try {
      // Asegurar que el ID sea un número
      const userId =
        typeof profile.id === 'string' ? parseInt(profile.id, 10) : profile.id;

      await axiosInstance.put(`/change-password`, {
        userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success('Contraseña actualizada correctamente');
      resetPassword();
      onClose();
    } catch (error: any) {
      console.error('Error al cambiar la contraseña:', error);

      let errorMessage = 'Error al cambiar la contraseña';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-medium">Gestionar Perfil</h3>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-3 px-4 font-medium focus:outline-none ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Datos Personales
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium focus:outline-none ${
              activeTab === 'password'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('password')}
          >
            Cambiar Contraseña
          </button>
        </div>

        {activeTab === 'profile' && (
          <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  {...registerProfile('name', {
                    required: 'El nombre es obligatorio',
                    minLength: {
                      value: 2,
                      message: 'El nombre debe tener al menos 2 caracteres',
                    },
                    maxLength: {
                      value: 50,
                      message: 'El nombre debe tener menos de 50 caracteres',
                    },
                  })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                {errorsProfile.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsProfile.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  {...registerProfile('lastName', {
                    required: 'El apellido es obligatorio',
                    minLength: {
                      value: 2,
                      message: 'El apellido debe tener al menos 2 caracteres',
                    },
                    maxLength: {
                      value: 50,
                      message: 'El apellido debe tener menos de 50 caracteres',
                    },
                  })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                {errorsProfile.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsProfile.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  {...registerProfile('email', {
                    required: 'El email es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Dirección de email inválida',
                    },
                  })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                {errorsProfile.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsProfile.email.message}
                  </p>
                )}
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              {userRole === Role.USER && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      {...registerProfile('height', {
                        valueAsNumber: true,
                        min: {
                          value: 50,
                          message: 'La altura debe ser mayor a 50 cm',
                        },
                        max: {
                          value: 250,
                          message: 'La altura debe ser menor a 250 cm',
                        },
                      })}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errorsProfile.height && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsProfile.height.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      * Ingresa la altura en centímetros
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      {...registerProfile('weight', {
                        valueAsNumber: true,
                        min: {
                          value: 20,
                          message: 'El peso debe ser mayor a 20 kg',
                        },
                        max: {
                          value: 300,
                          message: 'El peso debe ser menor a 300 kg',
                        },
                      })}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errorsProfile.weight && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsProfile.weight.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      {...registerProfile('phone', {
                        minLength: {
                          value: 10,
                          message: 'El teléfono debe tener al menos 10 dígitos',
                        },
                        maxLength: {
                          value: 15,
                          message: 'El teléfono debe tener menos de 15 dígitos',
                        },
                      })}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errorsProfile.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsProfile.phone.message}
                      </p>
                    )}
                  </div>
                </>
              )}
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
                disabled={isSubmittingProfile}
              >
                {isSubmittingProfile ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  {...registerPassword('currentPassword', {
                    required: 'La contraseña actual es obligatoria',
                  })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                {errorsPassword.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsPassword.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  {...registerPassword('newPassword', {
                    required: 'La nueva contraseña es obligatoria',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres',
                    },
                  })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                {errorsPassword.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsPassword.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  {...registerPassword('confirmPassword', {
                    required: 'Confirma tu nueva contraseña',
                    validate: (value) =>
                      value === newPassword || 'Las contraseñas no coinciden',
                  })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                {errorsPassword.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsPassword.confirmPassword.message}
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
                disabled={isSubmittingPassword}
              >
                {isSubmittingPassword ? (
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
        )}
      </div>
    </div>
  );
};

export default ProfileEditModal;
