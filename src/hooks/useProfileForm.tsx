import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Role } from '../constants';
import {
  updateUserPassword,
  updateUserProfile,
} from '../services/profileService';
import { UserProfile, useUserProfileStore } from '../store/useUserProfileStore';

interface ProfileFormData {
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  height?: number;
  weight?: number;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
}

interface UseProfileFormProps {
  profile: UserProfile;
  userRole: string;
  onClose: () => void;
}

export const useProfileForm = ({
  profile,
  userRole,
  onClose,
}: UseProfileFormProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { updateUserProfile: updateProfileStore } = useUserProfileStore();

  const isAdmin = userRole === Role.ADMIN;
  const isTrainer = userRole === Role.TRAINER;
  const isUser = userRole === Role.USER;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Observamos el valor de la contraseña para validar la confirmación
  const password = watch('password');

  // Cargar datos iniciales - Memoizado con useCallback
  const loadInitialData = useCallback(
    (profileData: UserProfile) => {
      if (isAdmin || isTrainer) {
        reset({
          name: profileData.name || '',
          email: profileData.email || '',
          currentPassword: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        reset({
          name: profileData.name || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          height: profileData.height,
          weight: profileData.weight,
          currentPassword: '',
          password: '',
          confirmPassword: '',
        });
      }
      setActiveTab('profile');
    },
    [isAdmin, isTrainer, reset, setActiveTab]
  );

  // Inicializar el formulario cuando el perfil cambia
  useEffect(() => {
    if (profile) {
      loadInitialData(profile);
    }
  }, [profile, loadInitialData]);

  // Manejar cambio de tab - Memoizado con useCallback
  const handleTabChange = useCallback((tab: 'profile' | 'password') => {
    setActiveTab(tab);
  }, []);

  // Manejar envío del formulario - Memoizado con useCallback
  const onSubmit = useCallback(
    async (data: ProfileFormData) => {
      setIsSubmitting(true);

      try {
        // Si estamos en la pestaña de cambio de contraseña
        if (activeTab === 'password') {
          if (
            !data.currentPassword ||
            !data.password ||
            !data.confirmPassword
          ) {
            throw new Error('Todos los campos de contraseña son obligatorios');
          }

          if (data.password !== data.confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
          }

          await updateUserPassword(
            {
              currentPassword: data.currentPassword,
              newPassword: data.password,
              confirmPassword: data.confirmPassword,
            },
            userRole
          );

          toast.success('Contraseña actualizada correctamente');
          onClose();
          return;
        }

        // Actualización de perfil
        const updatedProfile = await updateUserProfile(
          {
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            height: data.height,
            weight: data.weight,
          },
          userRole,
          profile
        );

        // Actualizar el store local
        updateProfileStore(updatedProfile);

        toast.success('Perfil actualizado correctamente');
        onClose();
      } catch (error: any) {
        console.error('Error al actualizar:', error);

        // Mensajes de error específicos
        if (error.response?.status === 401) {
          toast.error('Contraseña actual incorrecta');
        } else if (error.response?.status === 409) {
          toast.error('El correo electrónico ya está en uso');
        } else {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              'Error al actualizar. Por favor, inténtalo de nuevo.'
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [activeTab, onClose, profile, updateProfileStore, userRole]
  );

  // Toggle visibilidad de contraseña - Memoizado con useCallback
  const togglePasswordVisibility = useCallback(
    (field: 'current' | 'new' | 'confirm') => {
      setShowPassword((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    []
  );

  // Preparar y memorizar el retorno del hook para evitar recreaciones innecesarias
  return {
    activeTab,
    setActiveTab: handleTabChange,
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
  };
};
