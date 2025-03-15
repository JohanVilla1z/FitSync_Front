import { Role } from "../constants/RolEnum";

/**
 * Verifica si un valor es un rol válido del sistema
 * @param role - El valor a verificar
 * @returns true si es un rol válido, false en caso contrario
 */
export const isValidRole = (role: any): role is Role => {
  if (typeof role !== "string") return false;
  return Object.values(Role).includes(role as Role);
};
