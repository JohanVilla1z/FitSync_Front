import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';
import { User } from '../constants';
import { assignTrainerToUser } from '../services/userService';

interface UserState {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  searchQuery: string;

  // Acciones
  fetchUsers: () => Promise<void>;
  fetchUsersIfNeeded: () => Promise<void>;
  toggleUserActivity: (userId: number) => Promise<User>;
  setSearchQuery: (query: string) => void;
  updateUserInStore: (updatedUser: User) => void;
  createUser: (newUser: Omit<User, 'id'>) => Promise<User>;
  updateUser: (updatedUser: User) => Promise<User>;
  clearUsers: () => void;
  assignTrainerToUser: (userId: number, trainerId: number) => Promise<boolean>;
  fetchUserById: (userId: number) => Promise<User>;
}

export const useUsersStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      filteredUsers: [],
      isLoading: false,
      error: null,
      lastFetched: null,
      searchQuery: '',

      // Obtener todos los usuarios
      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          // Forzar a no usar caché para obtener datos frescos
          const response = await axiosInstance.get<User[]>('/user/all', {
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
            },
          });

          set({
            users: response.data,
            filteredUsers: response.data,
            isLoading: false,
            lastFetched: Date.now(),
          });

          console.log('Usuarios actualizados:', response.data.length);
        } catch (error) {
          console.error('Error fetching users:', error);
          set({
            error: 'Error al obtener los usuarios',
            isLoading: false,
          });
        }
      },

      // Obtener un usuario específico por ID
      fetchUserById: async (userId: number) => {
        try {
          const response = await axiosInstance.get<User>(`/user/${userId}`);

          // Actualizar el usuario en el estado
          set((state) => ({
            users: state.users.map((user) =>
              user.id === userId ? response.data : user
            ),
            filteredUsers: state.filteredUsers.map((user) =>
              user.id === userId ? response.data : user
            ),
          }));

          return response.data;
        } catch (error) {
          console.error(`Error al obtener el usuario con ID ${userId}:`, error);
          throw error;
        }
      },

      // Obtener usuarios si es necesario
      fetchUsersIfNeeded: async () => {
        const { lastFetched, fetchUsers } = get();
        const now = Date.now();

        // Si los usuarios no se han cargado recientemente (por ejemplo, en los últimos 5 minutos), cargar usuarios
        if (!lastFetched || now - lastFetched > 5 * 60 * 1000) {
          await fetchUsers();
        }
      },

      // Cambiar estado de actividad del usuario
      toggleUserActivity: async (userId) => {
        try {
          const response = await axiosInstance.put<User>(
            `/user/${userId}/toggle-status`
          );

          // Actualizar el usuario en el estado
          set((state) => ({
            users: state.users.map((user) =>
              user.id === userId ? response.data : user
            ),
            filteredUsers: state.filteredUsers.map((user) =>
              user.id === userId ? response.data : user
            ),
          }));

          return response.data;
        } catch (error) {
          console.error('Error toggling user activity:', error);
          throw error;
        }
      },

      // Establecer búsqueda y filtrar usuarios
      setSearchQuery: (query) => {
        const { users } = get();
        const lowercaseQuery = query.toLowerCase();

        const filtered =
          query === ''
            ? [...users]
            : users.filter(
                (user) =>
                  user.name.toLowerCase().includes(lowercaseQuery) ||
                  user.lastName.toLowerCase().includes(lowercaseQuery) ||
                  user.email.toLowerCase().includes(lowercaseQuery)
              );

        set({
          searchQuery: query,
          filteredUsers: filtered,
        });
      },

      // Actualizar un usuario existente
      updateUser: async (updatedUser: User) => {
        try {
          // Crear una copia para no modificar el objeto original
          const dataToSend = { ...updatedUser };

          // Si el teléfono está vacío, enviarlo como null
          if (dataToSend.phone === '') {
            dataToSend.phone = null;
          }

          // Asegurarse de que los números sean realmente números
          if (dataToSend.height !== undefined) {
            dataToSend.height = Number(dataToSend.height);
          }

          if (dataToSend.weight !== undefined) {
            dataToSend.weight = Number(dataToSend.weight);
          }

          console.log(
            'Datos a enviar para actualización de usuario:',
            dataToSend
          );

          const response = await axiosInstance.put<User>(
            `/user/${updatedUser.id}`,
            dataToSend
          );

          console.log('Respuesta del servidor:', response.data);

          // Actualizar el usuario en el estado
          set((state) => ({
            users: state.users.map((user) =>
              user.id === updatedUser.id ? response.data : user
            ),
            filteredUsers: state.filteredUsers.map((user) =>
              user.id === updatedUser.id ? response.data : user
            ),
          }));

          console.log('Response from server after update:', response.data);
          return response.data;
        } catch (error: any) {
          console.error('Error detallado al actualizar el usuario:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
          throw error;
        }
      },

      // Crear un nuevo usuario
      createUser: async (newUser: Omit<User, 'id'>) => {
        try {
          const response = await axiosInstance.post<User>(
            '/auth/register-user',
            newUser
          );

          // Actualizar el estado global con el nuevo usuario
          set((state) => ({
            users: [...state.users, response.data],
            filteredUsers: [...state.filteredUsers, response.data],
          }));

          return response.data;
        } catch (error) {
          console.error('Error al crear el usuario:', error);
          throw error;
        }
      },

      // Actualizar un usuario en el estado local (sin backend)
      updateUserInStore: (updatedUser: User) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          ),
          filteredUsers: state.filteredUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          ),
        }));
      },

      // Añadir esta función al objeto que se pasa a create()
      assignTrainerToUser: async (userId: number, trainerId: number) => {
        try {
          // Llamar al servicio para asignar el entrenador
          await assignTrainerToUser(userId, trainerId);

          // Obtener el usuario actualizado para reflejar los cambios
          await get().fetchUserById(userId);

          return true;
        } catch (error) {
          console.error('Error al asignar entrenador:', error);
          throw error;
        }
      },

      // Limpiar usuarios (útil para logout)
      clearUsers: () =>
        set({ users: [], filteredUsers: [], lastFetched: null }),
    }),
    { name: 'user-storage' }
  )
);
