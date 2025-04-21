import { create } from 'zustand';
import { Equipment } from '../constants/equipment';
import {
  createEquipment as createEquipmentService,
  EquipmentPage,
  fetchEquipments,
  updateEquipment as updateEquipmentService,
} from '../services/equipmentService';

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
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  searchQuery?: string;
  statusFilter?: string;

  fetchEquipment: (
    page?: number,
    size?: number,
    search?: string,
    status?: string
  ) => Promise<void>;
  createEquipment: (newEquipment: Omit<Equipment, 'id'>) => Promise<void>;
  updateEquipment: (updatedEquipment: Equipment) => Promise<void>;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
}

function calculateStats(equipment: Equipment[]) {
  const total = equipment.length;
  const available = equipment.filter((item) => item.status === 'AVAILABLE').length;
  const onLoan = equipment.filter((item) => item.status === 'LOANED').length;
  const unavailable = equipment.filter((item) => item.status === 'UNAVAILABLE').length;
  return { total, available, onLoan, unavailable };
}

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  equipment: [],
  isLoading: false,
  error: null,
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
  searchQuery: '',
  statusFilter: 'todos',

  equipmentStats: {
    total: 0,
    available: 0,
    onLoan: 0,
    unavailable: 0,
  },

  fetchEquipment: async (
    page = get().page,
    size = get().size,
    search = get().searchQuery,
    status = get().statusFilter
  ) => {
    set({ isLoading: true, error: null });
    try {
      const data: EquipmentPage = await fetchEquipments(
        page,
        size,
        search,
        status
      );
      const stats = calculateStats(data.content);
      set({
        equipment: data.content,
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        equipmentStats: stats,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Error al obtener los equipos', isLoading: false });
    }
  },

  createEquipment: async (newEquipment) => {
    set({ isLoading: true });
    try {
      await createEquipmentService(newEquipment);
      await get().fetchEquipment(
        0,
        get().size,
        get().searchQuery,
        get().statusFilter
      );
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Error al crear el equipo', isLoading: false });
    }
  },

  updateEquipment: async (updatedEquipment) => {
    set({ isLoading: true });
    try {
      await updateEquipmentService(updatedEquipment);
      await get().fetchEquipment(
        get().page,
        get().size,
        get().searchQuery,
        get().statusFilter
      );
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Error al actualizar el equipo', isLoading: false });
    }
  },

  setPage: (page: number) => set({ page }),
  setSize: (size: number) => set({ size }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setStatusFilter: (status: string) => set({ statusFilter: status }),
}));
