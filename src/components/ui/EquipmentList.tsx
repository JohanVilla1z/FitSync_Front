import { useEffect, useState } from 'react';
import { useEquipmentStore } from '../../store/useEquipmentStore';
import EquipmentModal from './EquipmentModal';
import EquipmentTable from './EquipmentTable';

const EquipmentList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { equipment, isLoading, fetchEquipment } = useEquipmentStore();

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Lista de Equipos</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar equipo..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md w-full sm:w-64 dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Crear Equipo
          </button>
        </div>
      </div>
      <EquipmentTable isLoading={isLoading} equipment={filteredEquipment} />
      {isModalOpen && (
        <EquipmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EquipmentList;
