import { Box, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import EquipmentList from '../../components/ui/EquipmentList';
import EquipmentModal from '../../components/ui/EquipmentModal';
import StatsCards, { StatItem } from '../../components/ui/StatsCards';
import { useEquipmentStore } from '../../store/useEquipmentStore';

const Equipment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchEquipment, fetchEquipmentStats, equipmentStats, isLoading } =
    useEquipmentStore();

  useEffect(() => {
    fetchEquipment();
    fetchEquipmentStats();
  }, [fetchEquipment, fetchEquipmentStats]);

  const statsCards: StatItem[] = [
    {
      title: 'Total Equipos',
      value: equipmentStats?.total || 0,
      color: 'default' as const,
    },
    {
      title: 'Disponibles',
      value: equipmentStats?.available || 0,
      color: 'green' as const,
    },
    {
      title: 'En préstamo',
      value: equipmentStats?.onLoan || 0,
      color: 'amber' as const,
    },
    {
      title: 'No disponibles',
      value: equipmentStats?.unavailable || 0,
      color: 'red' as const,
    },
  ];

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Box size={28} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold">Equipamiento</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Administra el equipamiento del gimnasio
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Nuevo Equipo</span>
          </button>
        </div>
      </header>

      {/* Estadísticas rápidas usando el componente */}
      <StatsCards stats={statsCards} isLoading={isLoading} />

      <section>
        <EquipmentList />
      </section>

      {/* Modal para crear/editar equipo */}
      <EquipmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Equipment;
