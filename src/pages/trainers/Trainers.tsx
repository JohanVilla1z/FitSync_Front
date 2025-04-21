import { UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import StatsCards, { StatItem } from '../../components/ui/StatsCards';
import TrainerList from '../../components/ui/TrainerList';
import TrainerModal from '../../components/ui/TrainerModal';
import { useTrainersStore } from '../../store/useTrainersStore';

const Trainers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchTrainers, fetchTrainerStats, trainerStats, isLoading } =
    useTrainersStore();

  useEffect(() => {
    fetchTrainers();
    fetchTrainerStats();
  }, [fetchTrainers, fetchTrainerStats]);

  const statsCards: StatItem[] = [
    {
      title: 'Total Entrenadores',
      value: trainerStats?.total || 0,
      color: 'default' as const,
    },
    {
      title: 'Entrenadores Activos',
      value: trainerStats?.active || 0,
      color: 'green' as const,
    },
    {
      title: 'Con Usuarios Asignados',
      value: trainerStats?.assignedUsers || 0,
      color: 'amber' as const,
    },
    {
      title: 'Sin Asignaciones',
      value: trainerStats?.unassignedTrainers || 0,
      color: 'red' as const,
    },
  ];

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users size={28} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold">Entrenadores</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Gestión de entrenadores del gimnasio
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={18} />
            <span>Nuevo Entrenador</span>
          </button>
        </div>
      </header>

      {/* Estadísticas rápidas usando el componente StatsCards */}
      <StatsCards stats={statsCards} isLoading={isLoading} />

      <section>
        <TrainerList />
      </section>

      {/* Modal para crear entrenadores */}
      {isModalOpen && (
        <TrainerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Trainers;
