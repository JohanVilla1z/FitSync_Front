export interface User {
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
