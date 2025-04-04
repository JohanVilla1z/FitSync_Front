import { useCallback, useEffect } from 'react';
import { useEntryLogStore } from '../store/useEntryLogStore';

/**
 * Hook para gestionar los registros de entrada al gimnasio, utilizando el store global
 * @param options Opciones de configuración
 * @returns Funciones y estados para manejar registros de entrada
 */
export const useEntryLogs = (
  options = { autoLoad: true, adminView: false }
) => {
  // Obtenemos todo del store
  const {
    entryLogs,
    isLoading,
    isRegistering,
    error,
    fetchEntryLogs,
    registerEntry,
    clearErrors,
    todayEntries,
    yesterdayEntries,
    isAdminView,
    toggleAdminView,
  } = useEntryLogStore();

  const loadEntryLogs = useCallback(
    (adminView = false) => {
      return fetchEntryLogs(adminView);
    },
    [fetchEntryLogs]
  );

  useEffect(() => {
    if (options.autoLoad) {
      loadEntryLogs(options.adminView);
    }
  }, [loadEntryLogs, options.autoLoad, options.adminView]);

  return {
    entryLogs,
    isLoadingLogs: isLoading,
    errorLogs: error ? { message: error } : null,
    isRegistering,
    registrationError: error && isRegistering ? { message: error } : null,
    isSuccess: !error && !isLoading && !isRegistering,
    todayEntries,
    yesterdayEntries,
    isAdminView,

    fetchEntryLogs: loadEntryLogs,
    registerEntry,
    clearRegistrationError: clearErrors,
    clearLogsError: clearErrors,
    toggleAdminView,
  };
};
