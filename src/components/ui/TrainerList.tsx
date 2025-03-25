import { useEffect, useState } from 'react';
import { useTrainersStore } from '../../store/useTrainersStore';
import TrainerModal from './TrainerModal';
import TrainerTable from './TrainerTable';

const TrainerList = () => {
  const { isLoading, filteredTrainers, fetchTrainers, setSearchQuery } =
    useTrainersStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Lista de Entrenadores</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar entrenador..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md w-full sm:w-64 dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Crear Entrenador
          </button>
        </div>
      </div>
      <TrainerTable isLoading={isLoading} trainers={filteredTrainers} />
      {isModalOpen && (
        <TrainerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TrainerList;
