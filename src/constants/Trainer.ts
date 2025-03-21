import { User } from './User';

export interface Trainer {
  id?: number; // Opcional, ya que no se envía al crear un nuevo entrenador
  name: string;
  email: string;
  password: string;
  users?: User[]; // Lista de usuarios asignados al entrenador (opcional)
}
