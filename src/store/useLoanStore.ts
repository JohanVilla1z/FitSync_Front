import { create } from 'zustand';
import { LoanAPIResponse } from '../constants';
import { loanService } from '../services/loanService';
import { useEquipmentStore } from './useEquipmentStore';

interface LoanState {
  loans: LoanAPIResponse[];
  userLoans: LoanAPIResponse[];
  activeLoans: LoanAPIResponse[];
  isLoading: boolean;
  error: string | null;
  fetchAllLoans: () => Promise<void>;
  fetchUserLoans: (userId: number) => Promise<void>;
  fetchActiveLoans: () => Promise<void>;
  createLoan: (userId: number, equipmentId: number) => Promise<void>;
  completeLoan: (loanId: number) => Promise<LoanAPIResponse>;
  refreshRelatedData: () => Promise<void>;
}

export const useLoanStore = create<LoanState>((set, get) => ({
  loans: [],
  userLoans: [],
  activeLoans: [],
  isLoading: false,
  error: null,

  fetchAllLoans: async () => {
    set({ isLoading: true, error: null });
    try {
      const loans = await loanService.getAllLoans();
      set({ loans, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Error al cargar los préstamos',
        isLoading: false,
      });
      console.error('Error fetching loans:', error);
    }
  },

  fetchUserLoans: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const userLoans = await loanService.getUserLoans(userId);
      set({ userLoans, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Error al cargar los préstamos del usuario',
        isLoading: false,
      });
      console.error('Error fetching user loans:', error);
    }
  },

  fetchActiveLoans: async () => {
    set({ isLoading: true, error: null });
    try {
      const allLoans = await loanService.getAllLoans();
      const activeLoansList = allLoans.filter(
        (loan) => loan.status === 'PENDING'
      );
      set({ activeLoans: activeLoansList, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Error al cargar los préstamos activos',
        isLoading: false,
      });
      console.error('Error fetching active loans:', error);
    }
  },

  refreshRelatedData: async () => {
    const promises = [];

    promises.push(
      get()
        .fetchAllLoans()
        .catch((error) => {
          console.error('Error updating loans:', error);
        })
    );

    try {
      const equipmentStore = useEquipmentStore.getState();
      promises.push(
        equipmentStore.fetchEquipment().catch((error) => {
          console.error('Error updating equipment:', error);
        })
      );
    } catch (error) {
      console.error('Error accessing equipment store:', error);
    }

    await Promise.allSettled(promises);
  },

  createLoan: async (userId: number, equipmentId: number) => {
    set({ isLoading: true, error: null });
    try {
      await loanService.createLoan(userId, equipmentId);
      await get().refreshRelatedData();
    } catch (error: any) {
      console.error('Error creating loan:', error);
      set({
        error: error.message || 'Error al crear el préstamo',
        isLoading: false,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  completeLoan: async (loanId: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedLoan = await loanService.completeLoan(loanId);

      await get().refreshRelatedData();

      return updatedLoan;
    } catch (error: any) {
      set({
        error: error.message || 'Error al completar el préstamo',
        isLoading: false,
      });
      console.error('Error completing loan:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
