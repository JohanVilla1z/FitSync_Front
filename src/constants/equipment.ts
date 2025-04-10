export type EquipmentStatus = 'AVAILABLE' | 'LOANED' | 'UNAVAILABLE';

export const statusDisplayNames: Record<EquipmentStatus, string> = {
  AVAILABLE: 'Disponible',
  LOANED: 'Prestado',
  UNAVAILABLE: 'No disponible',
};

export interface Equipment {
  id: number;
  name: string;
  description: string;
  status: EquipmentStatus;
  currentLoans: number;
  loanCount: number;
}
