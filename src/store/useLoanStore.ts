import { create } from 'zustand';
import { LoanAPIResponse } from '../constants';
import { loanService } from '../services/loanService';

interface LoanState {
  loans: LoanAPIResponse[];
  userLoans: LoanAPIResponse[];
  isLoading: boolean;
  error: string | null;
  fetchAllLoans: () => Promise<void>;
  fetchUserLoans: (userId: number) => Promise<void>;
  createLoan: (userId: number, equipmentId: number) => Promise<void>;
  completeLoan: (loanId: number) => Promise<void>;
}

export const useLoanStore = create<LoanState>((set) => ({
  loans: [],
  userLoans: [],
  isLoading: false,
  error: null,

  fetchAllLoans: async () => {
    set({ isLoading: true, error: null });
    try {
      const loans = await loanService.getAllLoans();
      set({ loans });
    } catch (error: any) {
      set({ error: error.message || 'Error al cargar los préstamos' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserLoans: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const userLoans = await loanService.getUserLoans(userId);
      set({ userLoans });
    } catch (error: any) {
      set({
        error: error.message || 'Error al cargar los préstamos del usuario',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createLoan: async (userId: number, equipmentId: number) => {
    set({ isLoading: true, error: null });
    try {
      const newLoan = await loanService.createLoan(userId, equipmentId);
      set((state) => ({ loans: [...state.loans, newLoan] }));
    } catch (error: any) {
      set({ error: error.message || 'Error al crear el préstamo' });
    } finally {
      set({ isLoading: false });
    }
  },

  completeLoan: async (loanId: number) => {
    set({ isLoading: true, error: null });
    try {
      const updatedLoan = await loanService.completeLoan(loanId);
      set((state) => ({
        loans: state.loans.map((loan) =>
          loan.id === loanId ? updatedLoan : loan
        ),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Error al completar el préstamo' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
