import axiosInstance from '../api/axiosInstance';
import { Role } from '../constants';
import { UserProfile } from '../store/useUserProfileStore';

interface ProfileUpdateData {
  name: string;
  lastName?: string;
  email: string;
  phone?: string | null;
  height?: number | null;
  weight?: number | null;
  isAvailable?: boolean;
}

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Determina el endpoint correcto según el rol
const getProfileEndpoint = (userRole: string): string => {
  if (userRole === Role.ADMIN) {
    return '/admin/profile';
  } else if (userRole === Role.TRAINER) {
    return '/trainer/profile';
  } else {
    return '/user/profile';
  }
};

// Determina el endpoint para cambio de contraseña según el rol
const getPasswordEndpoint = (userRole: string): string => {
  if (userRole === Role.ADMIN) {
    return '/admin/update-password';
  } else if (userRole === Role.TRAINER) {
    return '/trainer/update-password';
  } else {
    return '/user/update-password';
  }
};

// Prepara el payload según el tipo de usuario
const prepareProfilePayload = (
  data: ProfileUpdateData,
  userRole: string,
  currentProfile: UserProfile
): any => {
  if (userRole === Role.ADMIN) {
    return {
      name: data.name,
      email: data.email,
    };
  } else if (userRole === Role.TRAINER) {
    return {
      name: data.name,
      email: data.email,
      isAvailable: currentProfile.isAvailable,
    };
  } else {
    return {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      height: data.height || null,
      weight: data.weight || null,
    };
  }
};

// Actualiza el perfil del usuario
export const updateUserProfile = async (
  profileData: ProfileUpdateData,
  userRole: string,
  currentProfile: UserProfile
): Promise<UserProfile> => {
  const endpoint = getProfileEndpoint(userRole);
  const payload = prepareProfilePayload(profileData, userRole, currentProfile);

  const response = await axiosInstance.put(endpoint, payload);
  return response.data;
};

// Actualiza la contraseña del usuario
export const updateUserPassword = async (
  passwordData: PasswordUpdateData,
  userRole: string
): Promise<void> => {
  const endpoint = getPasswordEndpoint(userRole);

  await axiosInstance.put(endpoint, passwordData);
};
