import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';
import { Trainer } from '../constants';

// Interfaz para las estadísticas de entrenadores
interface TrainerStats {
  total: number;
  active: number;
  assignedUsers: number;
  unassignedTrainers: number;
}

interface TrainerState {
  trainers: Trainer[];
  filteredTrainers: Trainer[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  searchQuery: string;
  trainerStats: TrainerStats;

  // Acciones
  fetchTrainers: () => Promise<void>;
  fetchTrainersIfNeeded: () => Promise<void>;
  toggleTrainerActivity: (trainerId: number) => Promise<Trainer>;
  setSearchQuery: (query: string) => void;
  createTrainer: (trainerData: Omit<Trainer, 'id'>) => Promise<Trainer>;
  updateTrainer: (updatedTrainer: Trainer) => Promise<Trainer>;
  clearTrainers: () => void;
  fetchTrainerStats: () => Promise<void>;
}

export const useTrainersStore = create<TrainerState>()(
  persist(
    (set, get) => ({
      trainers: [],
      filteredTrainers: [],
      isLoading: false,
      error: null,
      lastFetched: null,
      searchQuery: '',
      trainerStats: {
        total: 0,
        active: 0,
        assignedUsers: 0,
        unassignedTrainers: 0,
      },

      // Obtener todos los trainers
      fetchTrainers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get<Trainer[]>('/trainer');
          set({
            trainers: response.data,
            filteredTrainers: response.data,
            isLoading: false,
            lastFetched: Date.now(),
          });

          // Actualizar las estadísticas automáticamente cuando se obtienen los entrenadores
          const currentState = get();
          if (currentState && currentState.fetchTrainerStats) {
            currentState.fetchTrainerStats();
          }
        } catch (error) {
          console.error('Error fetching trainers:', error);
          set({
            error: 'Error al obtener los entrenadores',
            isLoading: false,
          });
        }
      },

      // Obtener trainers solo si es necesario
      fetchTrainersIfNeeded: async () => {
        const { lastFetched, trainers, fetchTrainers } = get();
        const now = Date.now();

        if (
          !lastFetched ||
          now - lastFetched > 5 * 60 * 1000 ||
          trainers.length === 0
        ) {
          await fetchTrainers();
        }
      },

      // Crear un nuevo entrenador
      createTrainer: async (trainerData) => {
        try {
          const response = await axiosInstance.post<Trainer>(
            '/trainer',
            trainerData
          );

          // Actualizar el estado con el nuevo entrenador
          set((state) => ({
            trainers: [...state.trainers, response.data],
            filteredTrainers: [...state.filteredTrainers, response.data],
          }));

          // Actualizar estadísticas después de crear un entrenador
          const currentState = get();
          if (currentState && currentState.fetchTrainerStats) {
            currentState.fetchTrainerStats();
          }

          return response.data;
        } catch (error) {
          console.error('Error creating trainer:', error);
          throw error;
        }
      },

      toggleTrainerActivity: async (trainerId) => {
        const { trainers } = get();
        const trainer = trainers.find((t) => t.id === trainerId);

        if (!trainer) {
          throw new Error('Entrenador no encontrado');
        }

        // Actualización optimista
        const previousState = [...trainers];
        const updatedTrainer = { ...trainer, active: !trainer.active };

        set((state) => ({
          trainers: state.trainers.map((t) =>
            t.id === trainerId ? updatedTrainer : t
          ),
          filteredTrainers: state.filteredTrainers.map((t) =>
            t.id === trainerId ? updatedTrainer : t
          ),
        }));

        try {
          // Solicitud al backend
          const response = await axiosInstance.put<Trainer>(
            `/trainer/${trainerId}/toggle-status`
          );

          // Actualizar el estado con la respuesta del backend
          set((state) => ({
            trainers: state.trainers.map((t) =>
              t.id === trainerId ? response.data : t
            ),
            filteredTrainers: state.filteredTrainers.map((t) =>
              t.id === trainerId ? response.data : t
            ),
          }));

          // Actualizar estadísticas después de cambiar el estado de actividad
          const currentState = get();
          if (currentState && currentState.fetchTrainerStats) {
            currentState.fetchTrainerStats();
          }

          return response.data;
        } catch (error) {
          console.error('Error al alternar el estado del entrenador:', error);

          // Revertir el cambio en caso de error
          set({ trainers: previousState, filteredTrainers: previousState });
          throw error;
        }
      },

      // Establecer búsqueda y filtrar trainers
      setSearchQuery: (query) => {
        const { trainers } = get();
        const lowercaseQuery = query.toLowerCase();

        const filtered =
          query === ''
            ? [...trainers]
            : trainers.filter(
                (trainer) =>
                  trainer.name.toLowerCase().includes(lowercaseQuery) ||
                  trainer.email.toLowerCase().includes(lowercaseQuery)
              );

        set({
          searchQuery: query,
          filteredTrainers: filtered,
        });
      },

      updateTrainer: async (updatedTrainer: Trainer) => {
        try {
          // Realizar la solicitud al backend para actualizar el entrenador
          await axiosInstance.put<Trainer>(
            `/trainer/${updatedTrainer.id}`,
            updatedTrainer
          );

          // Realizar un refetch completo de los entrenadores
          const response = await axiosInstance.get<Trainer[]>('/trainer');

          // Actualizar el estado global con los datos más recientes
          set({
            trainers: response.data,
            filteredTrainers: response.data,
          });

          // Actualizar estadísticas después de actualizar un entrenador
          const currentState = get();
          if (currentState && currentState.fetchTrainerStats) {
            currentState.fetchTrainerStats();
          }

          return updatedTrainer; // Devolver el entrenador actualizado
        } catch (error) {
          console.error('Error al actualizar el entrenador:', error);
          throw error; // Lanzar el error para manejarlo en el componente
        }
      },

      // Limpiar trainers
      clearTrainers: () =>
        set({
          trainers: [],
          filteredTrainers: [],
          lastFetched: null,
          trainerStats: {
            total: 0,
            active: 0,
            assignedUsers: 0,
            unassignedTrainers: 0,
          },
        }),

      // Nueva función para calcular y actualizar estadísticas de entrenadores
      fetchTrainerStats: async () => {
        const { trainers } = get();

        if (trainers.length === 0) {
          return; // No hay datos para calcular estadísticas
        }

        // Calcular estadísticas basadas en los datos existentes
        const total = trainers.length;
        const active = trainers.filter((trainer) => trainer.active).length;

        // Calcular el número total de usuarios asignados contando los IDs en userIds
        const assignedUsers = trainers.reduce((sum, trainer) => {
          return sum + (trainer.userIds?.length || 0);
        }, 0);

        // Contar entrenadores activos sin usuarios asignados
        const unassignedTrainers = trainers.filter(
          (trainer) =>
            trainer.active && (!trainer.userIds || trainer.userIds.length === 0)
        ).length;

        // Actualizar el estado con las estadísticas calculadas
        set({
          trainerStats: {
            total,
            active,
            assignedUsers,
            unassignedTrainers,
          },
        });
      },
    }),
    { name: 'trainers-storage' }
  )
);
