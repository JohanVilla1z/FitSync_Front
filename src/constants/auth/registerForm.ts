import { User } from "../User";

export default interface RegisterForm {
  name: string;
  lastName: string;
  email: string;
  password: string;
  userHeight: number; // Mantener para compatibilidad con el registro
  userWeight: number; // Mantener para compatibilidad con el registro
  phone?: string; // Añadir para compatibilidad con User
}

// Opcional: Crear un adaptador para convertir entre User y RegisterForm
export const userToRegisterForm = (user: Partial<User>): RegisterForm => ({
  name: user.name || '',
  lastName: user.lastName || '',
  email: user.email || '',
  password: '', // No incluir contraseña al convertir de User a RegisterForm
  userHeight: user.height || 0,
  userWeight: user.weight || 0,
  phone: user.phone || '',
});

export const registerFormToUser = (form: RegisterForm): Partial<User> => ({
  name: form.name,
  lastName: form.lastName,
  email: form.email,
  height: form.userHeight,
  weight: form.userWeight,
  phone: form.phone || null,
});
