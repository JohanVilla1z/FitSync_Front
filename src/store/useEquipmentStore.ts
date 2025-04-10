import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import { Equipment } from '../constants/equipment';

interface EquipmentState {
  equipment: Equipment[];
  isLoading: boolean;
  error: string | null;
  equipmentStats: {
    total: number;
    available: number;
    onLoan: number;
    unavailable: number;
  };

  fetchEquipment: () => Promise<void>;
  createEquipment: (newEquipment: Omit<Equipment, 'id'>) => Promise<void>;
  updateEquipment: (updatedEquipment: Equipment) => Promise<void>;
  fetchEquipmentStats: () => Promise<void>;
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
      console.error('Error creating equipment:', error);
      set({ error: 'Error al crear el equipo', isLoading: false });
    }
  },

  updateEquipment: async (updatedEquipment) => {
    set({ isLoading: true });
    try {
      const { id, ...equipmentData } = updatedEquipment;

      await axiosInstance.put<Equipment>(`/equipment/${id}`, equipmentData);

      const response = await axiosInstance.get<Equipment[]>('/equipment');
      set({ equipment: response.data, isLoading: false });
    } catch (error) {
      console.error('Error updating equipment:', error);
      set({ error: 'Error al actualizar el equipo', isLoading: false });
    }
  },

  equipmentStats: {
    total: 0,
    available: 0,
    onLoan: 0,
    unavailable: 0,
  },

  fetchEquipmentStats: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get<Equipment[]>('/equipment');
      const equipment = response.data;

      if (equipment && equipment.length > 0) {
        const total = equipment.length;
        const available = equipment.filter(
          (item) => item.status === 'AVAILABLE'
        ).length;
        const onLoan = equipment.filter(
          (item) => item.status === 'LOANED'
        ).length;
        const unavailable = equipment.filter(
          (item) => item.status === 'UNAVAILABLE'
        ).length;

        set({
          equipmentStats: { total, available, onLoan, unavailable },
          isLoading: false,
        });
      } else {
        set({
          equipmentStats: { total: 0, available: 0, onLoan: 0, unavailable: 0 },
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error fetching equipment stats:', error);
      set({ isLoading: false });
    }
  },
}));
