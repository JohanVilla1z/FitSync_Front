import { useTrainerUsers } from '../../../hooks/usTrainerUsers';
import { UserProfile } from '../../../store/useUserProfileStore';
import TrainerUsersList from './TrainerUsersList';

interface TrainerProfileContentProps {
  profile: UserProfile;
  userRole: string;
}

const TrainerProfileContent = ({ profile }: TrainerProfileContentProps) => {
  const {
    users: trainerUsers,
    isLoading: isLoadingUsers,
    refreshUsers: handleRefreshUsers,
  } = useTrainerUsers({
    trainerId: profile.id,
  });

  const renderTrainerInfo = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Información Personal</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nombre completo
              </h3>
              <p className="mt-1 text-sm">
                {profile.name} {profile.lastName}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </h3>
              <p className="mt-1 text-sm">{profile.email}</p>
            </div>
            {profile.registerDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Miembro desde
                </h3>
                <p className="mt-1 text-sm">
                  {new Date(profile.registerDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Estado
              </h3>
              <p className="mt-1 text-sm flex items-center">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    profile.isAvailable ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></span>
                {profile.isAvailable ? 'Disponible' : 'No disponible'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderTrainerInfo()}

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xl font-semibold mb-4">Mis Usuarios</h2>
        <TrainerUsersList
          users={trainerUsers}
          isLoading={isLoadingUsers}
          onRefresh={handleRefreshUsers}
        />
      </div>
    </div>
  );
};

export default TrainerProfileContent;
