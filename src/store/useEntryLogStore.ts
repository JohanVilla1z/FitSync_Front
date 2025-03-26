import { create } from 'zustand';
import { getUserEntryLogs } from '../services/userService';
import { EntryLog } from '../constants';

interface EntryLogState {
  entryLogs: EntryLog[];
  isLoading: boolean;
  error: string | null;
  fetchEntryLogs: () => Promise<void>;
}

export const useEntryLogStore = create<EntryLogState>((set) => ({
  entryLogs: [],
  isLoading: false,
  error: null,

  fetchEntryLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const logs = await getUserEntryLogs();
      set({ entryLogs: logs, isLoading: false });
    } catch (error: any) {
      set({
        error: 'No se pudo cargar el historial de entradas.',
        isLoading: false,
      });
    }
  },
}));
