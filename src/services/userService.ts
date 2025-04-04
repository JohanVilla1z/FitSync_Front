import axiosInstance from '../api/axiosInstance';
import { User } from '../constants/User';

/**
 * Interfaz para las estadísticas de usuarios
 * Esta interfaz debe coincidir con los datos calculados en el cliente
 */
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  withTrainer?: number;
}

/**
 * Interfaz para estadísticas históricas
 * Esta interfaz se usa para datos simulados ya que no hay endpoint en el backend
 */
export interface HistoricalUserStats {
  date: string;
  stats: UserStats;
}

/**
 * Interfaz para la respuesta de perfil de usuario
 * Esta interfaz coincide con UserProfileResponse del backend
 */
export interface UserProfileResponse {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string | null;
  weight: number;
  height: number;
  isActive: boolean;
  registerDate: string;
  currentIMC: number;
  trainerName?: string | null;
  trainerEmail?: string | null;
}

/**
 * Obtiene todos los usuarios (solo para administradores)
 * @returns Lista de todos los usuarios
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    // Corregido para usar el endpoint correcto según UserController.java
    const response =
      await axiosInstance.get<UserProfileResponse[]>('/user/all');

    // Adaptamos el formato de la respuesta a nuestro modelo User
    return response.data.map(profileToUser);
  } catch (error: any) {
    console.error(
      'Error al obtener todos los usuarios:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Obtiene el perfil del usuario autenticado
 * @returns Datos del perfil de usuario
 */
export const getUserProfile = async (): Promise<User> => {
  try {
    const response =
      await axiosInstance.get<UserProfileResponse>('/user/profile');
    return profileToUser(response.data);
  } catch (error: any) {
    console.error(
      'Error al obtener el perfil de usuario:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Actualiza la contraseña del usuario actual
 * @param currentPassword La contraseña actual
 * @param newPassword La nueva contraseña
 * @returns Un mensaje de confirmación
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
 * Actualiza el perfil del usuario actual
 * @param userData Los datos actualizados del usuario
 * @returns Los datos del perfil actualizado
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

    const response = await axiosInstance.put<UserProfileResponse>(
      '/user/profile',
      dataToSend
    );
    return profileToUser(response.data);
  } catch (error: any) {
    console.error(
      'Error al actualizar el perfil:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Obtiene un usuario por su ID (solo administradores)
 * @param userId ID del usuario a obtener
 * @returns Datos del usuario
 */
export const getUserById = async (userId: number): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>(`/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el usuario con ID ${userId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Cambia el estado de actividad de un usuario (solo administradores)
 * @param userId ID del usuario
 * @returns Usuario actualizado
 */
export const toggleUserStatus = async (userId: number): Promise<User> => {
  try {
    const response = await axiosInstance.put<UserProfileResponse>(
      `/user/${userId}/toggle-status`
    );
    return profileToUser(response.data);
  } catch (error: any) {
    console.error(
      'Error al cambiar el estado del usuario:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Actualiza datos de un usuario (solo administradores)
 * @param userData Datos actualizados del usuario
 * @returns Usuario actualizado
 */
export const updateUser = async (userData: User): Promise<User> => {
  try {
    // Crear una copia para no modificar el objeto original
    const dataToSend = { ...userData };

    // Si el teléfono está vacío, enviarlo como null
    if (dataToSend.phone === '') {
      dataToSend.phone = null;
    }

    const response = await axiosInstance.put<User>(
      `/user/${userData.id}`,
      dataToSend
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Error al actualizar el usuario:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Asigna un entrenador a un usuario
 * @param userId ID del usuario
 * @param trainerId ID del entrenador a asignar
 * @returns Respuesta del servidor
 */
export const assignTrainerToUser = async (
  userId: number,
  trainerId: number
): Promise<any> => {
  try {
    // Asegúrate de que los valores sean números
    const payload = {
      userId: Number(userId),
      trainerId: Number(trainerId),
    };

    const response = await axiosInstance.post('/trainer/assign-user', payload);
    return response.data;
  } catch (error: any) {
    console.error(
      'Error al asignar entrenador al usuario:',
      error.response?.data || error.message
    );
    // Mostrar más detalles del error
    if (error.response) {
      console.error('Detalles del error:', error.response.data);
    }
    throw error;
  }
};

/**
 * Función auxiliar para convertir UserProfileResponse a User
 * @param profile Perfil de usuario del backend
 * @returns Usuario formateado para el frontend
 */
const profileToUser = (profile: UserProfileResponse): User => {
  return {
    id: profile.id,
    name: profile.name,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    weight: profile.weight,
    height: profile.height,
    currentIMC:
      profile.weight / ((profile.height / 100) * (profile.height / 100)),
    isActive: profile.isActive,
    registerDate: profile.registerDate,
    trainerName: profile.trainerName || null,
    trainerEmail: profile.trainerEmail || null,
  };
};
