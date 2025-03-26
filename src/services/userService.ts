import axiosInstance from '../api/axiosInstance';
import { EntryLog } from '../constants';

/**
 * Obtiene el historial de entradas del usuario autenticado.
 * @returns Una lista de registros de entrada.
 */
export const getUserEntryLogs = async (): Promise<EntryLog[]> => {
  try {
    const response = await axiosInstance.get<EntryLog[]>(
      '/entry-logs/user-history'
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Error al obtener el historial de entradas:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Registra una nueva entrada al gimnasio para el usuario autenticado.
 * @returns Los datos de la entrada registrada.
 */
export const registerGymEntry = async (): Promise<EntryLog> => {
  try {
    const response = await axiosInstance.post<EntryLog>('/entry-logs');
    return response.data;
  } catch (error: any) {
    console.error(
      'Error al registrar entrada al gimnasio:',
      error.response?.data || error.message
    );
    throw error;
  }
};
