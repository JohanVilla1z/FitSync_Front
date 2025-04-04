import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { EntryLog } from '../constants/entryLog';
import * as entryLogService from '../services/entryLogService';

interface EntryLogState {
  entryLogs: EntryLog[];
  todayEntries: number;
  yesterdayEntries: number;

  isLoading: boolean;
  isRegistering: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isAdminView: boolean;

  fetchEntryLogs: (isAdmin?: boolean) => Promise<EntryLog[]>;
  registerEntry: () => Promise<boolean>;
  clearErrors: () => void;
  refreshStats: () => void;
  toggleAdminView: () => void;
}

export const useEntryLogStore = create<EntryLogState>()(
  devtools(
    (set, get) => ({
      entryLogs: [],
      todayEntries: 0,
      yesterdayEntries: 0,
      isLoading: false,
      isRegistering: false,
      error: null,
      lastUpdated: null,
      isAdminView: false,

      fetchEntryLogs: async (isAdmin = false) => {
        set({ isLoading: true, error: null });
        try {
          const logs = isAdmin
            ? await entryLogService.getAllEntryLogs()
            : await entryLogService.getUserEntryLogs();

          set({
            entryLogs: logs,
            isLoading: false,
            lastUpdated: new Date(),
            isAdminView: isAdmin,
          });

          get().refreshStats();

          return logs;
        } catch (error: any) {
          console.error('Error al cargar historial de entradas:', error);
          set({
            error: 'No se pudo cargar el historial de entradas.',
            isLoading: false,
          });
          return [];
        }
      },

      registerEntry: async () => {
        set({ isRegistering: true, error: null });
        try {
          await entryLogService.registerEntry();

          await get().fetchEntryLogs(get().isAdminView);

          set({ isRegistering: false });
          return true;
        } catch (error: any) {
          console.error('Error al registrar entrada:', error);

          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'No se pudo registrar la entrada. Inténtalo de nuevo.';

          set({
            error: errorMessage,
            isRegistering: false,
          });

          return false;
        }
      },

      toggleAdminView: () => {
        const currentIsAdminView = get().isAdminView;
        const newIsAdminView = !currentIsAdminView;

        set({ isAdminView: newIsAdminView });
        get().fetchEntryLogs(newIsAdminView);
      },

      clearErrors: () => set({ error: null }),

      refreshStats: () => {
        const { entryLogs } = get();
        if (!entryLogs || entryLogs.length === 0) {
          set({ todayEntries: 0, yesterdayEntries: 0 });
          return;
        }

        const isToday = (dateString: string) => {
          if (!dateString) return false;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const date = new Date(dateString);
          const dateOnly = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );
          dateOnly.setHours(0, 0, 0, 0);

          return dateOnly.toDateString() === today.toDateString();
        };

        const isYesterday = (dateString: string) => {
          if (!dateString) return false;

          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);

          const date = new Date(dateString);
          const dateOnly = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );
          dateOnly.setHours(0, 0, 0, 0);

          return dateOnly.toDateString() === yesterday.toDateString();
        };

        const todayCount = entryLogs.filter((log) =>
          isToday(log.timestamp)
        ).length;
        const yesterdayCount = entryLogs.filter((log) =>
          isYesterday(log.timestamp)
        ).length;

        set({ todayEntries: todayCount, yesterdayEntries: yesterdayCount });

        console.log({
          message: 'Estadísticas de entradas actualizadas en el store',
          totalLogs: entryLogs.length,
          todayEntries: todayCount,
          yesterdayEntries: yesterdayCount,
          isAdminView: get().isAdminView,
        });
      },
    }),
    { name: 'entry-logs-store' }
  )
);
