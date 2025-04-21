import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { User } from '../constants/User';
import { getTrainerUsers } from '../services/trainerService';

interface UseTrainerUsersProps {
  trainerId?: number;
  initialUsers?: User[];
}

/**
 * Hook personalizado para manejar usuarios asignados a un entrenador
 * @param trainerId ID del entrenador
 * @param initialUsers Lista inicial de usuarios (opcional)
 */
export const useTrainerUsers = ({
  trainerId,
  initialUsers = [],
}: UseTrainerUsersProps) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga los usuarios asignados al entrenador
   */
  const loadUsers = useCallback(async () => {
    if (!trainerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const trainerUsers = await getTrainerUsers(trainerId);
      setUsers(trainerUsers);
    } catch (err: any) {
      console.error('Error al cargar usuarios del entrenador:', err);
      setError('No se pudieron cargar los usuarios asignados');
      toast.error('No se pudieron cargar los usuarios asignados');
    } finally {
      setIsLoading(false);
    }
  }, [trainerId]);

  /**
   * Recarga manualmente los usuarios desde la API
   */
  const refreshUsers = useCallback(async () => {
    if (!trainerId) {
      toast.error('ID de entrenador no disponible');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const freshUsers = await getTrainerUsers(trainerId);
      setUsers(freshUsers);
      toast.success('Lista de usuarios actualizada');
    } catch (err: any) {
      console.error('Error al refrescar usuarios:', err);
      setError('No se pudo actualizar la lista de usuarios');
      toast.error('No se pudo actualizar la lista de usuarios');
    } finally {
      setIsLoading(false);
    }
  }, [trainerId]);

  // Cargar usuarios cuando cambia el ID del entrenador
  useEffect(() => {
    if (trainerId) {
      loadUsers();
    }
  }, [trainerId, loadUsers]);

  return {
    users,
    isLoading,
    error,
    refreshUsers,
    loadUsers,
  };
};
