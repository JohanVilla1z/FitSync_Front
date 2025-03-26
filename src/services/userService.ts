import axiosInstance from '../api/axiosInstance';
import { EntryLog, User } from '../constants';

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

/**
 * Actualiza la contraseña del usuario actual.
 * @param currentPassword La contraseña actual.
 * @param newPassword La nueva contraseña.
 * @returns Un mensaje de confirmación.
 */
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.put<{ message: string }>(
      '/user/update-password',
      { currentPassword, newPassword }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Error al actualizar la contraseña:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Actualiza el perfil del usuario actual.
 * @param userData Los datos actualizados del usuario.
 * @returns Los datos del perfil actualizado.
 */
export const updateUserProfile = async (
  userData: Partial<User>
): Promise<User> => {
  try {
    // Crear una copia de los datos para no modificar el objeto original
    const dataToSend = { ...userData };

    // Si el teléfono está vacío, configurarlo como null
    if (dataToSend.phone === '') {
      dataToSend.phone = null;
    }

    const response = await axiosInstance.put<User>('/user/profile', dataToSend);
    return response.data;
  } catch (error: any) {
    console.error(
      'Error al actualizar el perfil:',
      error.response?.data || error.message
    );
    throw error;
  }
};
