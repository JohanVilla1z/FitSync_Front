import { Check, Pencil, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Equipment } from '../../constants/equipment';
import { useEquipmentStore } from '../../store/useEquipmentStore';
import EquipmentModal from './EquipmentModal';

interface EquipmentTableProps {
  isLoading: boolean;
  equipment: Equipment[];
}

const EquipmentTable = ({ isLoading, equipment }: EquipmentTableProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const { updateEquipment } = useEquipmentStore();

  const handleEdit = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsEditModalOpen(true);
  };

  const handleToggleAvailability = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsConfirmModalOpen(true);
  };

  const confirmToggleAvailability = async () => {
    if (!selectedEquipment) return;

    try {
      // Crear una copia del equipo con disponibilidad invertida
      const updatedEquipment = {
        ...selectedEquipment,
        available: !selectedEquipment.available,
      };

      await updateEquipment(updatedEquipment);

      toast.success(
        `El equipo ${selectedEquipment.name} ahora está ${
          !selectedEquipment.available ? 'disponible' : 'no disponible'
        }`
      );
    } catch (error) {
      console.error('Error al cambiar la disponibilidad:', error);
      toast.error('Error al cambiar la disponibilidad del equipo');
    } finally {
      setIsConfirmModalOpen(false);
      setSelectedEquipment(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Equipamiento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Disponibilidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Préstamos
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
                <div className="mt-2">Cargando equipamiento...</div>
              </td>
            </tr>
          ) : equipment.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-10 text-center whitespace-nowrap text-gray-500 dark:text-gray-400"
              >
                No hay equipamiento disponible.
              </td>
            </tr>
          ) : (
            equipment.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {item.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {item.description || 'Sin descripción'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.available
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {item.available ? 'Disponible' : 'No disponible'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {item.currentLoans > 0 ? (
                      <span className="font-medium">{item.currentLoans}</span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        0
                      </span>
                    )}
                    {item.currentLoans === 1 ? ' préstamo' : ' préstamos'}{' '}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      title="Editar equipamiento"
                    >
                      <Pencil
                        size={18}
                        className="text-amber-600 dark:text-amber-400"
                      />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      title={
                        item.available
                          ? 'Marcar como no disponible'
                          : 'Marcar como disponible'
                      }
                      onClick={() => handleToggleAvailability(item)}
                    >
                      {item.available ? (
                        <X
                          size={18}
                          className="text-red-600 dark:text-red-400"
                        />
                      ) : (
                        <Check
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

      {/* Modal para editar equipo */}
      {isEditModalOpen && selectedEquipment && (
        <EquipmentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEquipment(null);
          }}
          equipment={selectedEquipment}
        />
      )}

      {/* Modal de confirmación para cambiar disponibilidad */}
      {isConfirmModalOpen && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirmar Cambio</h2>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <p className="mb-6 text-gray-600 dark:text-gray-300">
              ¿Estás seguro de que deseas marcar "{selectedEquipment.name}" como{' '}
              {selectedEquipment.available ? 'no disponible' : 'disponible'}?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={confirmToggleAvailability}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentTable;
