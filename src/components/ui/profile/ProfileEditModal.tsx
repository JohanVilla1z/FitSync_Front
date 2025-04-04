import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
  Ruler,
  Save,
  User,
  Weight,
  X,
} from 'lucide-react';
import { useEffect } from 'react';
import { useProfileForm } from '../../../hooks/useProfileForm';
import { UserProfile } from '../../../store/useUserProfileStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  userRole: string;
}

const ProfileEditModal = ({
  isOpen,
  onClose,
  profile,
  userRole,
}: ProfileEditModalProps) => {
  const {
    activeTab,
    setActiveTab,
    isSubmitting,
    showPassword,
    register,
    errors,
    handleSubmit,
    onSubmit,
    togglePasswordVisibility,
    password,
    loadInitialData,
    isAdmin,
    isTrainer,
    isUser,
  } = useProfileForm({ profile, userRole, onClose });

  // Cargar datos iniciales al abrir el modal
  useEffect(() => {
    if (profile && isOpen) {
      loadInitialData(profile);
    }
  }, [profile, isOpen, loadInitialData]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader className="px-6 pt-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          {/* Título y botón de cierre en una fila */}
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Editar Perfil
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="mb-4">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('profile')}
                type="button"
              >
                <User className="h-4 w-4" />
                Información Personal
              </button>
              <button
                className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'password'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('password')}
                type="button"
              >
                <KeyRound className="h-4 w-4" />
                Cambiar Contraseña
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {activeTab === 'profile' && (
              <>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
                    >
                      Nombre
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        {...register('name', {
                          required: 'El nombre es obligatorio',
                          minLength: {
                            value: 2,
                            message:
                              'El nombre debe tener al menos 2 caracteres',
                          },
                        })}
                        className="mt-1 block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        placeholder="Ingresa tu nombre"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <X className="h-3.5 w-3.5" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {isUser && (
                    <div>
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
                      >
                        Apellido
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="lastName"
                          {...register('lastName', {
                            required: 'El apellido es obligatorio',
                            minLength: {
                              value: 2,
                              message:
                                'El apellido debe tener al menos 2 caracteres',
                            },
                          })}
                          className="mt-1 block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                          placeholder="Ingresa tu apellido"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <User className="h-4 w-4" />
                        </div>
                      </div>
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <X className="h-3.5 w-3.5" />
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        {...register('email', {
                          required: 'El email es obligatorio',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Dirección de email inválida',
                          },
                        })}
                        className="mt-1 block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        placeholder="ejemplo@correo.com"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Mail className="h-4 w-4" />
                      </div>
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <X className="h-3.5 w-3.5" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {isUser && (
                    <>
                      <div>
                        <label
                          htmlFor="phone"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
                        >
                          Teléfono
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            id="phone"
                            {...register('phone')}
                            className="mt-1 block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                            placeholder="Tu número de teléfono"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Phone className="h-4 w-4" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="height"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
                          >
                            Altura (m)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="height"
                              step="0.01"
                              min="0.5"
                              max="2.5"
                              {...register('height', {
                                valueAsNumber: true,
                                min: {
                                  value: 0.5,
                                  message: 'La altura mínima es 0.5m',
                                },
                                max: {
                                  value: 2.5,
                                  message: 'La altura máxima es 2.5m',
                                },
                              })}
                              className="mt-1 block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                              placeholder="1.70"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                              <Ruler className="h-4 w-4" />
                            </div>
                          </div>
                          {errors.height && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                              <X className="h-3.5 w-3.5" />
                              {errors.height.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="weight"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
                          >
                            Peso (kg)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="weight"
                              step="0.1"
                              min="20"
                              max="250"
                              {...register('weight', {
                                valueAsNumber: true,
                                min: {
                                  value: 20,
                                  message: 'El peso mínimo es 20kg',
                                },
                                max: {
                                  value: 250,
                                  message: 'El peso máximo es 250kg',
                                },
                              })}
                              className="mt-1 block w-full pl-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                              placeholder="70.5"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                              <Weight className="h-4 w-4" />
                            </div>
                          </div>
                          {errors.weight && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                              <X className="h-3.5 w-3.5" />
                              {errors.weight.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {activeTab === 'password' && (
              <>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
                    >
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        id="currentPassword"
                        {...register('currentPassword', {
                          required: 'La contraseña actual es obligatoria',
                        })}
                        className="mt-1 block w-full pl-10 pr-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        placeholder="Ingresa tu contraseña actual"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Lock className="h-4 w-4" />
                      </div>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        onClick={() => togglePasswordVisibility('current')}
                        aria-label={
                          showPassword.current
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                      >
                        {showPassword.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <X className="h-3.5 w-3.5" />
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
                    >
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        id="password"
                        {...register('password', {
                          required: 'La nueva contraseña es obligatoria',
                          minLength: {
                            value: 6,
                            message:
                              'La contraseña debe tener al menos 6 caracteres',
                          },
                        })}
                        className="mt-1 block w-full pl-10 pr-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        placeholder="Ingresa tu nueva contraseña"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        onClick={() => togglePasswordVisibility('new')}
                        aria-label={
                          showPassword.new
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                      >
                        {showPassword.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <X className="h-3.5 w-3.5" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"
                    >
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        id="confirmPassword"
                        {...register('confirmPassword', {
                          required: 'Confirma tu nueva contraseña',
                          validate: (value) =>
                            value === password ||
                            'Las contraseñas no coinciden',
                        })}
                        className="mt-1 block w-full pl-10 pr-10 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        placeholder="Confirma tu nueva contraseña"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        onClick={() => togglePasswordVisibility('confirm')}
                        aria-label={
                          showPassword.confirm
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <X className="h-3.5 w-3.5" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200 dark:border-gray-700 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors flex items-center gap-2"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
