import { useEffect } from 'react';
import { useTrainersStore } from '../../store/useTrainersStore';
import TrainerTable from './TrainerTable';

const TrainerList = () => {
  const { isLoading, filteredTrainers, fetchTrainers, setSearchQuery } =
    useTrainersStore();

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Lista de Entrenadores</h2>
        <input
          type="text"
          placeholder="Buscar entrenador..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-full sm:w-64 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>
      <TrainerTable isLoading={isLoading} trainers={filteredTrainers} />
    </div>
  );
};

export default TrainerList;
