import axiosInstance from '../api/axiosInstance';
import { LoanAPIResponse } from '../constants';

export const loanService = {
  /**
   * Obtiene todos los préstamos del sistema.
   * @returns Lista de préstamos en la estructura del backend.
   */
  async getAllLoans(): Promise<LoanAPIResponse[]> {
    const response = await axiosInstance.get<LoanAPIResponse[]>('/loans');
    return response.data;
  },

  /**
   * Obtiene los préstamos de un usuario específico.
   * @param userId ID del usuario.
   * @returns Lista de préstamos del usuario en la estructura del backend.
   */
  async getUserLoans(userId: number): Promise<LoanAPIResponse[]> {
    const response = await axiosInstance.get<LoanAPIResponse[]>(
      `/loans/user/${userId}`
    );
    return response.data;
  },

  /**
   * Crea un nuevo préstamo.
   * @param userId ID del usuario que solicita el préstamo.
   * @param equipmentId ID del equipo a prestar.
   * @returns Respuesta del backend con los datos del préstamo creado.
   */
  async createLoan(
    userId: number,
    equipmentId: number
  ): Promise<LoanAPIResponse> {
    const response = await axiosInstance.post<LoanAPIResponse>('/loans', {
      userId,
      equipmentId,
    });
    return response.data;
  },

  /**
   * Marca un préstamo como completado.
   * @param loanId ID del préstamo a completar.
   * @returns Préstamo actualizado en la estructura del backend.
   */
  async completeLoan(loanId: number): Promise<LoanAPIResponse> {
    const response = await axiosInstance.post<LoanAPIResponse>(
      `/loans/${loanId}/complete`
    );
    return response.data;
  },
};
