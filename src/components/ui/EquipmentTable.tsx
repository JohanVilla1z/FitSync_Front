import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Equipment } from '../../constants/equipment';
import EquipmentModal from './EquipmentModal';

interface EquipmentTableProps {
  isLoading: boolean;
  equipment: Equipment[];
}

const EquipmentTable = ({ isLoading, equipment }: EquipmentTableProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );

  const handleEdit = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsEditModalOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left">
            <th className="px-4 py-2 border-b dark:border-gray-600">ID</th>
            <th className="px-4 py-2 border-b dark:border-gray-600">Nombre</th>
            <th className="px-4 py-2 border-b dark:border-gray-600">
              Descripción
            </th>
            <th className="px-4 py-2 border-b dark:border-gray-600">
              Disponible
            </th>
            <th className="px-4 py-2 border-b dark:border-gray-600">
              Préstamos Actuales
            </th>
            <th className="px-4 py-2 border-b dark:border-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Cargando...
              </td>
            </tr>
          ) : equipment.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No hay equipos disponibles.
              </td>
            </tr>
          ) : (
            equipment.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  {item.id}
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  {item.name}
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  {item.description}
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  <div className="flex items-center justify-evenly">
                    <span>{item.available ? 'Sí' : 'No'}</span>
                    <span
                      className={`ml-2 h-3 w-3 rounded-full ${
                        item.available ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                  </div>
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  {item.currentLoans}
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  <button onClick={() => handleEdit(item)}>
                    <Pencil size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal para editar equipo */}
      {isEditModalOpen && (
        <EquipmentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEquipment(null);
          }}
          equipment={selectedEquipment ?? undefined}
        />
      )}
    </div>
  );
};

export default EquipmentTable;
