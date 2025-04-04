import axiosInstance from '../api/axiosInstance';
import { EntryLog } from '../constants/entryLog';

/**
 * Obtiene el historial de entradas del usuario actual
 * @returns Lista de registros de entrada
 */
export const getUserEntryLogs = async (): Promise<EntryLog[]> => {
  try {
    const response = await axiosInstance.get<EntryLog[]>(
      '/entry-logs/user-history'
    );
    console.log('Datos de entrada de usuario obtenidos:', response.data.length);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener historial de entradas del usuario:', error);
    throw error;
  }
};

/**
 * Obtiene todos los registros de entrada (solo admin)
 * @returns Lista de todos los registros
 */
export const getAllEntryLogs = async (): Promise<EntryLog[]> => {
  try {
    const response = await axiosInstance.get<EntryLog[]>('/entry-logs/all');
    console.log(
      'Todos los registros de entrada obtenidos:',
      response.data.length
    );
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener todos los registros de entrada:', error);
    throw error;
  }
};

/**
 * Registra una nueva entrada al gimnasio
 * @returns Datos de la entrada registrada
 */
export const registerEntry = async (): Promise<EntryLog> => {
  try {
    const response = await axiosInstance.post<EntryLog>('/entry-logs');
    return response.data;
  } catch (error: any) {
    console.error('Error al registrar entrada:', error);
    throw error;
  }
};
