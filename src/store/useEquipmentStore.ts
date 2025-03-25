import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import { Equipment } from '../constants/equipment';

interface EquipmentState {
  equipment: Equipment[];
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchEquipment: () => Promise<void>;
  createEquipment: (newEquipment: Omit<Equipment, 'id'>) => Promise<void>;
  updateEquipment: (updatedEquipment: Equipment) => Promise<void>;
}

export const useEquipmentStore = create<EquipmentState>((set) => ({
  equipment: [],
  isLoading: false,
  error: null,

  fetchEquipment: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<Equipment[]>('/equipment');
      set({ equipment: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Error al obtener los equipos', isLoading: false });
    }
  },

  createEquipment: async (newEquipment) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post<Equipment>('/equipment', newEquipment);
      const response = await axiosInstance.get<Equipment[]>('/equipment');
      set({ equipment: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Error al crear el equipo', isLoading: false });
    }
  },

  updateEquipment: async (updatedEquipment) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put<Equipment>(
        `/equipment/${updatedEquipment.id}`,
        updatedEquipment
      );
      const response = await axiosInstance.get<Equipment[]>('/equipment');
      set({ equipment: response.data, isLoading: false });
    } catch (error) {
      console.error('Error updating equipment:', error);
      set({ error: 'Error al actualizar el equipo', isLoading: false });
    }
  },
}));
