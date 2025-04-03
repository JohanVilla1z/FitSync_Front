import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../components/ui';
import ProfileHeader from '../../components/ui/profile/ProfileHeader';
import ProfileRoleIcon from '../../components/ui/profile/ProfileRoleIcon';
// Importamos correctamente los componentes de contenido
import UserProfileContent from '../../components/ui/profile/UserProfileContent';
import TrainerProfileContent from '../../components/ui/profile/TrainerProfileContent';
import AdminProfileContent from '../../components/ui/profile/AdminProfileContent';
import { Role, User } from '../../constants';
import { useAuthStore, useUserProfileStore } from '../../store';
import { UserProfile } from '../../store/useUserProfileStore';
import ProfileEditModal from '../../components/ui/profile/ProfileEditModal';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    profile,
    isLoading: isLoadingProfile,
    error: profileError,
    fetchUserProfile,
  } = useUserProfileStore();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Determinar el rol
  const userRole = profile?.role || user?.role || Role.USER;
  const isAdmin = userRole === Role.ADMIN;
  const isTrainer = userRole === Role.TRAINER;
  const isRegularUser = userRole === Role.USER;

  // Cargar perfil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchUserProfile();
      } catch (error: any) {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          toast.error(
            'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
          );
          logout();
          navigate('/login');
        } else {
          toast.error('No se pudo cargar tu perfil. Inténtalo nuevamente.');
        }
      }
    };

    loadProfile();
  }, [fetchUserProfile, logout, navigate]);

  // Spinner de carga
  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <Spinner className="h-12 w-12 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  // Mensaje de error
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-md"
          role="alert"
        >
          <p className="font-medium">No se pudo cargar el perfil.</p>
          <p className="mt-1">
            {profileError || 'Por favor, intenta recargar la página.'}
          </p>
          <button
            onClick={async () => {
              try {
                await fetchUserProfile();
              } catch (error) {
                // Los errores ya se manejan en el useEffect
              }
            }}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  // Contenido específico según rol con tipado actualizado
  const renderProfileContent = () => {
    // Adaptamos el perfil al tipo esperado por los componentes
    const userProfileData = {
      ...profile,
      // Aseguramos que los campos opcionales tengan valores por defecto
      phone: profile.phone || null,
      weight: profile.weight || 0,
      height: profile.height || 0,
      currentIMC: profile.currentIMC || null,
      trainerName: profile.trainerName || null,
      trainerEmail: profile.trainerEmail || null,
    };

    if (isRegularUser) {
      return (
        <UserProfileContent profile={userProfileData} userRole={userRole} />
      );
    } else if (isTrainer) {
      return (
        <TrainerProfileContent profile={userProfileData} userRole={userRole} />
      );
    } else if (isAdmin) {
      return <AdminProfileContent profile={userProfileData} />;
    }
    return null;
  };

  return (
    <main className="flex justify-center items-center h-full p-4 relative">
      <section className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Header con botón de edición */}
        <ProfileHeader
          profile={profile}
          onEditClick={() => setIsProfileModalOpen(true)}
        />

        {/* Icono del rol */}
        <ProfileRoleIcon userRole={userRole} />

        {/* Contenido específico */}
        {renderProfileContent()}
      </section>

      {/* Modal de edición */}
      {profile && (
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          profile={profile}
          userRole={userRole}
        />
      )}
    </main>
  );
};

export default Profile;
