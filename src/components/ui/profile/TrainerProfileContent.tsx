import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../api/axiosInstance';
import { useUsersStore } from '../../../store';
import { User, UserProfile } from '../../../store/useUserProfileStore';
import TrainerUsersList from './TrainerUsersList';

interface TrainerProfileContentProps {
  profile: UserProfile;
  userRole: string;
}

const TrainerProfileContent = ({
  profile,
}: TrainerProfileContentProps) => {
  const [trainerUsers, setTrainerUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Obtener el store de usuarios
  const { users, fetchUsers } = useUsersStore();

  // Función para obtener usuarios directamente de la API si es necesario
  const fetchTrainerUsersDirectly = async (trainerId: number) => {
    try {
      const response = await axiosInstance.get<any[]>(
        `/api/trainers/${trainerId}/users`
      );

      // Procesar los datos para adaptarlos a nuestro formato
      return response.data.map((user) => ({
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
    } catch (error) {
      console.error('Error al obtener usuarios del entrenador:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadUsersData = async () => {
      try {
        setIsLoadingUsers(true);

        // Si ya tenemos la lista procesada en el perfil, usarla directamente
        if (profile.usersList && profile.usersList.length > 0) {
          console.log(
            'Usando usuarios procesados del perfil:',
            profile.usersList.length
          );
          setTrainerUsers(profile.usersList);
          setIsLoadingUsers(false);
          return;
        }

        // Si tenemos los datos originales, procesarlos
        if (profile.users && profile.users.length > 0) {
          console.log('Procesando usuarios del perfil');
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
          setIsLoadingUsers(false);
          return;
        }

        // Si tenemos IDs de usuarios pero no detalles, buscar en el store
        if (profile.userIds && profile.userIds.length > 0) {
          // Verificar si ya tenemos estos usuarios en el store
          if (users && users.length > 0) {
            // Filtrar los usuarios que pertenecen al entrenador
            const userDetails = users.filter((user) =>
              profile.userIds?.includes(user.id)
            );

            console.log('Usuarios encontrados en store:', userDetails.length);

            // Si tenemos todos los usuarios en el store, los usamos
            if (userDetails.length === profile.userIds.length) {
              setTrainerUsers(userDetails);
              setIsLoadingUsers(false);
              return;
            }
          }

          // Si no tenemos todos los usuarios en el store o el store está vacío
          await fetchUsers();

          // Filtrar usuarios después de cargarlos
          const userDetails = users.filter((user) =>
            profile.userIds?.includes(user.id)
          );

          setTrainerUsers(userDetails);
        }

        // Último recurso: obtener directamente de la API
        if (trainerUsers.length === 0) {
          console.log('Intentando obtener usuarios directamente de la API');
          const directUsers = await fetchTrainerUsersDirectly(profile.id);
          if (directUsers.length > 0) {
            setTrainerUsers(directUsers);
          }
        }
      } catch (error) {
        console.error('Error al cargar usuarios del entrenador:', error);
        toast.error('No se pudieron cargar los usuarios asignados');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsersData();
  }, [profile, users, fetchUsers]);

  // Función para refrescar manualmente la lista de usuarios
  const handleRefreshUsers = async () => {
    try {
      setIsLoadingUsers(true);

      // Obtener directamente de la API para asegurarnos de tener datos frescos
      const directUsers = await fetchTrainerUsersDirectly(profile.id);
      if (directUsers.length > 0) {
        setTrainerUsers(directUsers);
        toast.success('Lista de usuarios actualizada');
        return;
      }

      // Si no podemos obtener directamente, intentar a través del store
      await fetchUsers();

      // Si tenemos IDs de usuarios, filtrar del store
      if (profile.userIds && profile.userIds.length > 0) {
        const userDetails = users.filter((user) =>
          profile.userIds?.includes(user.id)
        );
        setTrainerUsers(userDetails);
        toast.success('Lista de usuarios actualizada');
      } else {
        toast.warning('No se encontraron usuarios para este entrenador');
      }
    } catch (error) {
      console.error('Error al refrescar usuarios:', error);
      toast.error('No se pudo actualizar la lista de usuarios');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Renderizar información básica del entrenador (no usar BasicInfo)
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
      {/* Mostramos información específica para entrenadores en lugar de BasicInfo */}
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
