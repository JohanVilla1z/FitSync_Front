import axiosInstance from '../api/axiosInstance';
import RegisterForm from '../constants/auth/registerForm';

/**
 * Registra un nuevo usuario en el sistema.
 * @param registerData - Datos del usuario a registrar.
 * @returns La respuesta del servidor.
 */
export const registerUser = async (registerData: RegisterForm) => {
  try {
    const response = await axiosInstance.post(
      '/auth/register-user',
      registerData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Error durante el registro:',
      error.response?.data || error.message
    );
    throw error; // Propaga el error para que sea manejado por el componente llamante
  }
};

/**
 * Inicia sesión en el sistema.
 * @param email - Correo electrónico del usuario.
 * @param password - Contraseña del usuario.
 * @returns La respuesta del servidor con el token de autenticación.
 */
export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    return response.data; // Devuelve el token y otros datos relacionados
  } catch (error: any) {
    console.error(
      'Error durante el inicio de sesión:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Cierra la sesión del usuario.
 */
export const logout = () => {
  try {
    // Aquí puedes limpiar el token del almacenamiento local o cookies
    localStorage.removeItem('auth-token');
    console.log('Sesión cerrada exitosamente.');
  } catch (error) {
    console.error('Error durante el cierre de sesión:', error);
  }
};
