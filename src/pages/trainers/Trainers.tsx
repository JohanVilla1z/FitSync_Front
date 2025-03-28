import { UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import TrainerList from '../../components/ui/TrainerList';
import TrainerModal from '../../components/ui/TrainerModal';

const Trainers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      {/* Estadísticas rápidas */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total Entrenadores
          </h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Entrenadores Activos
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            10
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Usuarios Asignados
          </h3>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            187
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Sin Asignaciones
          </h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">2</p>
        </div>
      </section>

      <section>
        <TrainerList />
      </section>

      {/* Modal para crear entrenadores */}
      {/* Asume que TrainerModal existe - si no existe deberás crearlo */}
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
