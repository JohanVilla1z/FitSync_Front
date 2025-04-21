import axiosInstance from '../api/axiosInstance';
import { User } from '../constants/User';
import { UserProfileResponse } from './userService';

/**
 * Obtiene los usuarios asignados a un entrenador específico
 * @param trainerId ID del entrenador
 * @returns Lista de usuarios asignados al entrenador
 */
export const getTrainerUsers = async (trainerId: number): Promise<User[]> => {
  try {
    // Usar el endpoint correcto que existe en el backend
    const response = await axiosInstance.get<UserProfileResponse[]>(
      `/trainer/${trainerId}/users`
    );

    // Mapear la respuesta al formato esperado por el frontend
    return response.data.map((user) => ({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      weight: user.weight,
      height: user.height,
      isActive: user.isActive,
      registerDate: user.registerDate,
      trainerName: user.trainerName || null,
      trainerEmail: user.trainerEmail || null,
      currentIMC: user.currentIMC ?? calculateIMC(user.weight, user.height),
    }));
  } catch (error: any) {
    console.error(
      'Error al obtener usuarios del entrenador:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Función auxiliar para calcular IMC con manejo seguro de valores nulos
 */
const calculateIMC = (
  weight: number | null,
  height: number | null
): number | null => {
  if (!weight || !height || height === 0) return null;
  return weight / ((height / 100) * (height / 100));
};
