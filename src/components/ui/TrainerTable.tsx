import { Pencil, User, UserX } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Trainer } from '../../constants';
import { useTrainersStore } from '../../store/useTrainersStore';
import ConfirmationModal from './ConfirmationModal';
import TrainerModal from './TrainerModal';

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

  const handleEdit = (trainer: Trainer) => {
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
          `El entrenador "${updatedTrainer.name}" ahora está ${
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
    } else {
      toast.error('No se pudo identificar al entrenador.');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Entrenador
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Contacto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Usuarios asignados
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {isLoading ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-4 text-center whitespace-nowrap text-gray-500 dark:text-gray-400"
              >
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
                <div className="mt-2">Cargando entrenadores...</div>
              </td>
            </tr>
          ) : trainers.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-10 text-center whitespace-nowrap text-gray-500 dark:text-gray-400"
              >
                No hay entrenadores disponibles.
              </td>
            </tr>
          ) : (
            trainers.map((trainer) => (
              <tr
                key={trainer.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {trainer.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {trainer.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {trainer.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {trainer.userIds ? trainer.userIds.length : 0} usuarios
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      trainer.active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {trainer.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(trainer)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      title="Editar entrenador"
                    >
                      <Pencil
                        size={18}
                        className="text-amber-600 dark:text-amber-400"
                      />
                    </button>
                    <button
                      onClick={() => handleToggleActivity(trainer)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      title={
                        trainer.active
                          ? 'Desactivar entrenador'
                          : 'Activar entrenador'
                      }
                    >
                      {trainer.active ? (
                        <UserX
                          size={18}
                          className="text-red-600 dark:text-red-400"
                        />
                      ) : (
                        <User
                          size={18}
                          className="text-green-600 dark:text-green-400"
                        />
                      )}
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
        title={`Confirmar ${
          selectedTrainer?.active ? 'Desactivación' : 'Activación'
        }`}
        message={`¿Estás seguro de que deseas ${
          selectedTrainer?.active ? 'desactivar' : 'activar'
        } al entrenador ${selectedTrainer?.name}?`}
        confirmText={`${selectedTrainer?.active ? 'Desactivar' : 'Activar'}`}
        cancelText="Cancelar"
        onConfirm={confirmToggleActivity}
        onCancel={() => {
          setSelectedTrainer(null);
          setIsConfirmationModalOpen(false);
        }}
      />

      {/* Modal de edicion */}
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
