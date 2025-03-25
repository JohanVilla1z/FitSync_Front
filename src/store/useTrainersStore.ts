import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';
import { Trainer } from '../constants';

interface TrainerState {
  trainers: Trainer[];
  filteredTrainers: Trainer[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  searchQuery: string;

  // Acciones
  fetchTrainers: () => Promise<void>;
  fetchTrainersIfNeeded: () => Promise<void>;
  toggleTrainerActivity: (trainerId: number) => Promise<Trainer>;
  setSearchQuery: (query: string) => void;
  createTrainer: (trainerData: Omit<Trainer, 'id'>) => Promise<Trainer>;
  updateTrainerInStore: (updatedTrainer: Trainer) => void;
  clearTrainers: () => void;
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

          return response.data;
        } catch (error) {
          console.error('Error creating trainer:', error);
          throw error;
        }
      },

      toggleTrainerActivity: async (trainerId) => {
        try {
          // Realizar la solicitud al endpoint para alternar el estado del entrenador
          const response = await axiosInstance.put<Trainer>(
            `/trainer/${trainerId}/toggle-status`
          );

          // Actualizar el entrenador en el estado global
          set((state) => ({
            trainers: state.trainers.map((trainer) =>
              trainer.id === trainerId ? response.data : trainer
            ),
            filteredTrainers: state.filteredTrainers.map((trainer) =>
              trainer.id === trainerId ? response.data : trainer
            ),
          }));

          return response.data; // Devolver el entrenador actualizado
        } catch (error) {
          console.error('Error al alternar el estado del entrenador:', error);
          throw error; // Lanzar el error para manejarlo en el componente
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

      // Actualizar un entrenador específico en el store
      updateTrainerInStore: (updatedTrainer) => {
        set((state) => ({
          trainers: state.trainers.map((trainer) =>
            trainer.id === updatedTrainer.id ? updatedTrainer : trainer
          ),
          filteredTrainers: state.filteredTrainers.map((trainer) =>
            trainer.id === updatedTrainer.id ? updatedTrainer : trainer
          ),
        }));
      },

      // Limpiar trainers
      clearTrainers: () =>
        set({ trainers: [], filteredTrainers: [], lastFetched: null }),
    }),
    { name: 'trainers-storage' }
  )
);
