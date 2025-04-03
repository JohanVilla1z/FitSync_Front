import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

// Interfaz base para todos los perfiles
interface BaseProfile {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  registerDate?: string;
  role?: string;
}

// Datos específicos para usuarios regulares que vienen del backend
interface UserBackendData {
  id: number;
  name: string;
  email: string;
  role: string | null;
  userLastName: string;
  isActive: boolean;
  registerDate: string;
  userPhone: string;
  userWeight: number;
  userHeight: number;
  currentIMC: number;
}

// Datos específicos para usuarios normalizados para el frontend
interface UserSpecificData {
  lastName: string;
  phone: string | null;
  weight: number;
  height: number;
  currentIMC: number | null;
  trainerName?: string | null;
  trainerEmail?: string | null;
}

// Datos específicos para entrenadores
interface TrainerSpecificData {
  isAvailable: boolean;
  lastName?: string;
  // En el caso de los entrenadores, en lugar de 'users' usaremos 'usersList'
  // para almacenar los usuarios procesados con formato normalizado
  usersList?: Array<User>;
  // Mantenemos el array original como viene del backend por compatibilidad
  users?: Array<UserBackendData>;
  // IDs extraídos para facilitar búsquedas
  userIds?: number[];
}

// Datos específicos para administradores
interface AdminSpecificData {
  adminSince?: string;
  lastName?: string;
}

// Tipo User normalizado para uso en la UI
export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role?: string;
  isActive: boolean;
  registerDate?: string;
  phone?: string | null;
  weight?: number;
  height?: number;
  currentIMC?: number | null;
  lastEntry?: string;
}

// Tipo unión para cualquier tipo de perfil
export type UserProfile = BaseProfile &
  Partial<UserSpecificData> &
  Partial<TrainerSpecificData> &
  Partial<AdminSpecificData>;

// Estado del store
interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<UserProfile | null>;
  updateUserProfile: (updatedProfile: Partial<UserProfile>) => void;
}

// Función para procesar usuarios del perfil de entrenador
const processTrainerUser = (backendUser: UserBackendData): User => {
  return {
    id: backendUser.id,
    name: backendUser.name,
    lastName: backendUser.userLastName,
    email: backendUser.email,
    role: backendUser.role || 'USER',
    isActive: backendUser.isActive,
    registerDate: backendUser.registerDate,
    phone: backendUser.userPhone,
    weight: backendUser.userWeight,
    height: backendUser.userHeight,
    currentIMC: backendUser.currentIMC,
  };
};

// Función para procesar el perfil completo
const processProfileData = (data: any): UserProfile => {
  // Base común para todos los perfiles
  const profile: UserProfile = {
    id: data.id,
    name: data.name,
    email: data.email,
    isActive: data.isActive,
    role: data.role,
    registerDate: data.registerDate,
  };

  // Procesar campos específicos según el rol
  if (data.isAvailable !== undefined) {
    // Es un entrenador
    profile.isAvailable = data.isAvailable;
    profile.lastName = data.lastName || '';

    // Procesar usuarios si existen
    if (data.users && Array.isArray(data.users)) {
      // Guardamos los datos originales
      profile.users = data.users;

      // Procesamos los usuarios para tener una estructura normalizada
      profile.usersList = data.users.map(processTrainerUser);

      // Extraemos IDs para facilitar búsquedas
      profile.userIds = data.users.map((user) => user.id);
    }
  } else if (data.adminSince !== undefined) {
    // Es un administrador
    profile.adminSince = data.adminSince;
    profile.lastName = data.lastName || '';
  } else {
    // Es un usuario regular
    profile.lastName = data.userLastName || data.lastName || '';
    profile.phone = data.userPhone || data.phone || null;
    profile.weight = data.userWeight || data.weight || 0;
    profile.height = data.userHeight || data.height || 0;
    profile.currentIMC = data.currentIMC || null;
    profile.trainerName = data.trainerName || null;
    profile.trainerEmail = data.trainerEmail || null;
  }

  return profile;
};

export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  // Obtener perfil
  fetchUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/profile');

      // Procesar los datos para normalizarlos
      const processedProfile = processProfileData(response.data);

      set({ profile: processedProfile, isLoading: false });
      return processedProfile;
    } catch (error: any) {
      console.error('Error al obtener el perfil del usuario:', error);

      // Mensaje según código HTTP
      let errorMessage = 'Error al obtener el perfil del usuario';

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage =
              'La sesión ha caducado. Por favor, inicia sesión nuevamente.';
            break;
          case 403:
            errorMessage = 'No tienes permisos para acceder a este recurso.';
            break;
          case 404:
            errorMessage = 'No se encontró el perfil de usuario.';
            break;
          case 500:
            errorMessage = 'Error del servidor. Inténtalo más tarde.';
            break;
        }
      }

      set({
        error: errorMessage,
        isLoading: false,
      });

      return null;
    }
  },

  // Actualizar perfil en el estado
  updateUserProfile: (updatedProfile) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updatedProfile } : null,
    })),
}));
