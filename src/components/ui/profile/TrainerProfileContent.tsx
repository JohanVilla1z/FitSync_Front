import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../api/axiosInstance';
import { useUsersStore } from '../../../store';
import { User, UserProfile } from '../../../store/useUserProfileStore';
import TrainerUsersList from './TrainerUsersList';

interface TrainerProfileContentProps {
  profile: UserProfile;
  userRole: string;
}

const TrainerProfileContent = ({ profile }: TrainerProfileContentProps) => {
  const [trainerUsers, setTrainerUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Simplificar acceso al store
  const { users, fetchUsers } = useUsersStore();

  // Función refactorizada para cargar usuarios, usa useCallback para evitar recreaciones
  const loadUsersData = useCallback(async () => {
    if (!profile?.id) return;

    setIsLoadingUsers(true);
    try {
      // Estrategia 1: Usar datos ya procesados si están disponibles
      if (profile.usersList && profile.usersList.length > 0) {
        setTrainerUsers(profile.usersList);
        return;
      }

      // Estrategia 2: Procesar datos del perfil si están disponibles
      if (profile.users && profile.users.length > 0) {
        const processedUsers = profile.users.map((user) => ({
          id: user.id,
          name: user.name,
          lastName: user.userLastName || '',
          email: user.email,
          role: user.role || 'USER',
          isActive: user.isActive,
          registerDate: user.registerDate,
          phone: user.userPhone,
          weight: user.userWeight,
          height: user.userHeight,
          currentIMC: user.currentIMC,
        }));
        setTrainerUsers(processedUsers);
        return;
      }

      // Estrategia 3: Filtrar del store de usuarios si tenemos IDs
      if (profile.userIds && profile.userIds.length > 0) {
        // Si no hay usuarios en el store o faltan algunos, cargarlos primero
        if (
          !users.length ||
          users.filter((u) => profile.userIds?.includes(u.id)).length !==
            profile.userIds.length
        ) {
          await fetchUsers();
        }

        const filteredUsers = users.filter((user) =>
          profile.userIds?.includes(user.id)
        );
        if (filteredUsers.length > 0) {
          setTrainerUsers(filteredUsers);
          return;
        }
      }

      // Estrategia 4: Cargar directamente de la API como último recurso
      const response = await axiosInstance.get<any[]>(
        `/trainers/${profile.id}/users`
      );
      const directUsers = response.data.map((user) => ({
        id: user.id,
        name: user.name,
        lastName: user.userLastName || '',
        email: user.email,
        role: user.role || 'USER',
        isActive: user.isActive,
        registerDate: user.registerDate,
        phone: user.userPhone,
        weight: user.userWeight,
        height: user.userHeight,
        currentIMC: user.currentIMC,
      }));

      setTrainerUsers(directUsers);
    } catch (error) {
      console.error('Error al cargar usuarios del entrenador:', error);
      toast.error('No se pudieron cargar los usuarios asignados');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [profile, users, fetchUsers]);

  // Cargar datos cuando cambia el perfil
  useEffect(() => {
    loadUsersData();
  }, [loadUsersData]);

  // Función simplificada para refrescar manualmente la lista
  const handleRefreshUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // Cargar directamente de la API para datos frescos
      const response = await axiosInstance.get<any[]>(
        `/trainers/${profile.id}/users`
      );
      const freshUsers = response.data.map((user) => ({
        id: user.id,
        name: user.name,
        lastName: user.userLastName || '',
        email: user.email,
        role: user.role || 'USER',
        isActive: user.isActive,
        registerDate: user.registerDate,
        phone: user.userPhone,
        weight: user.userWeight,
        height: user.userHeight,
        currentIMC: user.currentIMC,
      }));

      setTrainerUsers(freshUsers);
      toast.success('Lista de usuarios actualizada');
    } catch (error) {
      console.error('Error al refrescar usuarios:', error);
      toast.error('No se pudo actualizar la lista de usuarios');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Renderizar información del entrenador (sin cambios)
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
