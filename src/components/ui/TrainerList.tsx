import { Search } from 'lucide-react';
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
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Lista de Entrenadores</h2>
        <div className="relative w-full md:w-1/4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar entrenador..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
      </section>
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
