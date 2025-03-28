export interface Trainer {
  id?: number; // Opcional, ya que no se envía al crear un nuevo entrenador
  name: string;
  email: string;
  password: string;
  active: boolean;
  available: boolean; // Indica si el entrenador está disponible para asignar
  userIds: number[]; // Lista de usuarios asignados al entrenador (opcional)
}
