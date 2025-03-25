import { Power } from 'lucide-react'; // Importar el ícono Power
import { useState } from 'react';
import { Trainer } from '../../constants';
import TrainerModal from './TrainerModal';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';
import { useTrainersStore } from '../../store/useTrainersStore';

interface TrainerTableProps {
  isLoading: boolean;
  trainers: Trainer[];
}

const TrainerTable = ({ isLoading, trainers }: TrainerTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const toggleTrainerActivity = useTrainersStore(
    (state) => state.toggleTrainerActivity
  );

  const handleViewDetails = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  const handleToggleActivity = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsConfirmationModalOpen(true);
  };

  const confirmToggleActivity = async () => {
    if (selectedTrainer && selectedTrainer.id) {
      try {
        const updatedTrainer = await toggleTrainerActivity(selectedTrainer.id);
        toast.success(
          `El entrenador ${updatedTrainer.name} ahora está ${
            updatedTrainer.active ? 'activo' : 'inactivo'
          }.`
        );
      } catch (error) {
        console.error('Error al cambiar el estado del entrenador:', error);
        toast.error('Error al cambiar el estado del entrenador.');
      } finally {
        setSelectedTrainer(null);
        setIsConfirmationModalOpen(false);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left">
            <th className="px-3 py-2 border-b dark:border-gray-600">ID</th>
            <th className="px-3 py-2 border-b dark:border-gray-600">Nombre</th>
            <th className="px-3 py-2 border-b dark:border-gray-600">Email</th>
            <th className="px-3 py-2 border-b dark:border-gray-600">Activo</th>
            <th className="px-3 py-2 border-b dark:border-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Cargando...
              </td>
            </tr>
          ) : trainers.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No hay entrenadores disponibles.
              </td>
            </tr>
          ) : (
            trainers.map((trainer) => (
              <tr
                key={trainer.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  {trainer.id}
                </td>
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  {trainer.name}
                </td>
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  {trainer.email}
                </td>
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  {trainer.active ? 'Sí' : 'No'}
                </td>
                <td className="px-3 py-2 border-b dark:border-gray-600">
                  <div className="flex items-center gap-2 justify-evenly">
                    {/* Botón para activar/desactivar */}
                    <button
                      onClick={() => handleToggleActivity(trainer)}
                      className={`h-5 w-5 rounded-full flex align-middle items-center bg-opacity-70 justify-center ${
                        trainer.active ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      <span className="align-middle">
                        <Power />
                      </span>
                    </button>

                    {/* Botón para ver detalles */}
                    <button
                      onClick={() => handleViewDetails(trainer)}
                      className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        title={`Confirmar ${selectedTrainer?.active ? 'Desactivación' : 'Activación'}`}
        message={`¿Estás seguro de que deseas ${
          selectedTrainer?.active ? 'desactivar' : 'activar'
        } al entrenador ${selectedTrainer?.name}?`}
        confirmText={`${selectedTrainer?.active ? 'Desactivar' : 'Activar'}`}
        cancelText="Cancelar"
        onConfirm={confirmToggleActivity}
        onCancel={() => setIsConfirmationModalOpen(false)}
      />

      {/* Modal para ver detalles */}
      {isModalOpen && selectedTrainer && (
        <TrainerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          trainer={selectedTrainer}
        />
      )}
    </div>
  );
};

export default TrainerTable;
