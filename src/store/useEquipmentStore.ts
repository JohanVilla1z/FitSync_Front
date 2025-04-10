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

  equipmentStats: {
    total: 0,
    available: 0,
    onLoan: 0,
    unavailable: 0,
  },

  fetchEquipmentStats: async () => {
    set({ isLoading: true });
    try {
      const equipment = await axiosInstance
        .get<Equipment[]>('/equipment')
        .then((res) => res.data);
      if (equipment.length > 0) {
        const total = equipment.length;
        const available = equipment.filter(
          (item: Equipment) => item.available && item.currentLoans === 0
        ).length;
        const onLoan = equipment.filter(
          (item: Equipment) => item.available && item.currentLoans > 0
        ).length;
        const unavailable = equipment.filter(
          (item: Equipment) => !item.available
        ).length;

        set({
          equipmentStats: { total, available, onLoan, unavailable },
          isLoading: false,
        });
        return;
      }
    } catch (error) {
      console.error('Error fetching equipment stats:', error);
      set({ isLoading: false });
    }
  },
}));
