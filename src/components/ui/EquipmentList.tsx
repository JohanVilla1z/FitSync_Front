import { Filter, Plus, RefreshCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EquipmentStatus, statusDisplayNames } from '../../constants/equipment';
import { useEquipmentStore } from '../../store/useEquipmentStore';
import EquipmentModal from './EquipmentModal';
import EquipmentTable from './EquipmentTable';
import StatusFilterButton from './StatusFilterButton';

const EquipmentList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | 'todos'>(
    'todos'
  );
  const { equipment, isLoading, fetchEquipment, fetchEquipmentStats } =
    useEquipmentStore();

  // Efecto inicial para cargar los datos
  useEffect(() => {
    loadEquipmentData();
  }, []);

  // Función para actualizar datos de equipamiento
  const loadEquipmentData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchEquipment(), fetchEquipmentStats()]);
    } catch (error) {
      console.error('Error al cargar equipamiento:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'todos' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <section className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">Lista de Equipos</h2>
            <button
              onClick={loadEquipmentData}
              disabled={isRefreshing || isLoading}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-label="Refrescar lista"
              title="Actualizar lista de equipos"
            >
              <RefreshCw
                size={20}
                className={`${isRefreshing && 'animate-spin'}`}
              />
            </button>
          </div>

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
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-3 mb-2">
            <Filter size={18} className="text-gray-500" />
            <div className="flex flex-wrap gap-2">
              <StatusFilterButton
                label="Todos"
                active={statusFilter === 'todos'}
                onClick={() => setStatusFilter('todos')}
              />
              <StatusFilterButton
                label={statusDisplayNames.AVAILABLE}
                active={statusFilter === 'AVAILABLE'}
                onClick={() => setStatusFilter('AVAILABLE')}
                color="green"
              />
              <StatusFilterButton
                label={statusDisplayNames.LOANED}
                active={statusFilter === 'LOANED'}
                onClick={() => setStatusFilter('LOANED')}
                color="amber"
              />
              <StatusFilterButton
                label={statusDisplayNames.UNAVAILABLE}
                active={statusFilter === 'UNAVAILABLE'}
                onClick={() => setStatusFilter('UNAVAILABLE')}
                color="red"
              />
            </div>
          </div>

          {/* Create equipment button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Nuevo Equipo</span>
          </button>
        </div>
      </section>

      <EquipmentTable
        isLoading={isLoading || isRefreshing}
        equipment={filteredEquipment}
        onRefresh={loadEquipmentData}
      />

      {isModalOpen && (
        <EquipmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            loadEquipmentData(); // Actualizar después de cerrar el modal
          }}
        />
      )}
    </div>
  );
};

export default EquipmentList;
