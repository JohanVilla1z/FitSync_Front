import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

interface UserProfile {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string | null;
  weight: number;
  height: number;
  isActive: boolean;
  registerDate: string;
  currentIMC: number | null;
  trainerName: string | null;
}

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (updatedProfile: Partial<UserProfile>) => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  // Función para obtener el perfil del usuario desde el endpoint
  fetchUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<UserProfile>('/user/profile');
      set({ profile: response.data, isLoading: false });
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      set({
        error: 'Error al obtener el perfil del usuario',
        isLoading: false,
      });
    }
  },

  // Función para actualizar el perfil del usuario en el estado
  updateUserProfile: (updatedProfile) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updatedProfile } : null,
    })),
}));
