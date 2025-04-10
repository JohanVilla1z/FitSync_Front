import { Box, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import EquipmentList from '../../components/ui/EquipmentList';
import EquipmentModal from '../../components/ui/EquipmentModal';
import StatsCards, { StatItem } from '../../components/ui/StatsCards';
import LoanList from '../../components/ui/loans/LoanList';
import LoanModal from '../../components/ui/loans/LoanModal';
import { useEquipmentStore } from '../../store/useEquipmentStore';

const Equipment = () => {
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
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
            onClick={() => setIsEquipmentModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Nuevo Equipo</span>
          </button>
        </div>
      </header>

      <StatsCards stats={statsCards} isLoading={isLoading} />

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Lista de Equipos</h2>
        <EquipmentList />
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Préstamos</h2>
          <button
            onClick={() => setIsLoanModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus size={18} />
            <span>Crear Préstamo</span>
          </button>
        </div>
        <LoanList />
      </section>

      {/* Modal para crear/editar equipo */}
      <EquipmentModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
      />

      {/* Modal para crear préstamos */}
      <LoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
      />
    </>
  );
};

export default Equipment;
