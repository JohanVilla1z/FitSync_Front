import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EntryLog } from '../constants/entryLog';
import { getUserEntryLogs, registerGymEntry } from '../services/userService';

interface EntryLogError {
  message: string;
  code?: string;
  details?: string;
}

/**
 * Hook para gestionar los registros de entrada al gimnasio
 * @returns Funciones y estados para manejar registros de entrada
 */
export const useEntryLogs = () => {
  const [entryLogs, setEntryLogs] = useState<EntryLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [errorLogs, setErrorLogs] = useState<EntryLogError | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registrationError, setRegistrationError] =
    useState<EntryLogError | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  /**
   * Obtiene el historial de entradas del usuario
   */
  const fetchEntryLogs = useCallback(async () => {
    try {
      setIsLoadingLogs(true);
      setErrorLogs(null);
      const logs = await getUserEntryLogs();
      setEntryLogs(logs);
    } catch (error: any) {
      console.error('Error al cargar historial de entradas:', error);
      setErrorLogs({
        message: 'No se pudo cargar el historial de entradas.',
        details: error.message,
        code: error.response?.status,
      });
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  /**
   * Registra una nueva entrada al gimnasio
   */
  const registerEntry = useCallback(async () => {
    setIsSuccess(false);

    try {
      setIsRegistering(true);
      setRegistrationError(null);

      await registerGymEntry();

      setIsSuccess(true);
      toast.success('Entrada registrada correctamente');

      await fetchEntryLogs();
    } catch (error: any) {
      console.error('Error al registrar entrada:', error);

      const errorMessage =
        error.response?.data?.message ||
        'No se pudo registrar la entrada. Inténtalo de nuevo.';

      setRegistrationError({
        message: errorMessage,
        code: error.response?.status,
        details: error.message,
      });

      toast.error(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  }, [fetchEntryLogs]);

  /**
   * Limpiar errores de registro
   */
  const clearRegistrationError = useCallback(() => {
    setRegistrationError(null);
  }, []);

  /**
   * Limpiar errores de carga de logs
   */
  const clearLogsError = useCallback(() => {
    setErrorLogs(null);
  }, []);

  useEffect(() => {
    fetchEntryLogs();

    return () => {
      setEntryLogs([]);
      setErrorLogs(null);
      setRegistrationError(null);
    };
  }, [fetchEntryLogs]);

  return {
    entryLogs,
    isLoadingLogs,
    errorLogs,
    isRegistering,
    registrationError,
    isSuccess,

    fetchEntryLogs,
    registerEntry,
    clearRegistrationError,
    clearLogsError,
  };
};
