import { useEffect, useState } from 'react';
import { useEquipmentStore } from '../../store/useEquipmentStore';
import EquipmentModal from './EquipmentModal';
import EquipmentTable from './EquipmentTable';
import { Search } from 'lucide-react';

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
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Lista de Equipos</h2>
        <div className="relative w-full md:w-1/4">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar equipo..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
      </section>
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
