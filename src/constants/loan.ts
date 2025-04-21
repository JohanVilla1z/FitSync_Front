import { Equipment } from './equipment';
import { User } from './User';

/**
 * Estructura interna del frontend para manejar préstamos.
 */
export interface Loan {
  id: number;
  user: User;
  equipment: Equipment;
  loanDate: string; // Fecha en formato ISO
  returnDate?: string; // Fecha en formato ISO (opcional)
  status: 'PENDING' | 'RETURNED'; // Estado del préstamo
}

/**
 * Estructura de la respuesta del backend para préstamos.
 */
export interface LoanAPIResponse {
  id: number;
  userName: string;
  userLastName: string;
  equipmentName: string;
  loanDate: string; // Fecha en formato ISO
  returnDate?: string; // Fecha en formato ISO (opcional)
  status: string; // Estado del préstamo como cadena
}
