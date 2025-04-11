import { Box, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
    const updateData = async () => {
      await fetchEquipment();
      await fetchEquipmentStats();
    };
    updateData();
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

  const handleOpenLoanModal = () => {
    fetchEquipment().then(() => {
      fetchEquipmentStats().then(() => {
        const availableCount = equipmentStats?.available || 0;

        if (availableCount === 0) {
          toast.info('No hay equipos disponibles para préstamo');
        } else {
          setIsLoanModalOpen(true);
        }
      });
    });
  };

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Box
              size={28}
              className="text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Equipamiento
            </h1>
          </div>
          <p className="text-muted-foreground mt-1 text-gray-600 dark:text-gray-300">
            Administra el equipamiento del gimnasio
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEquipmentModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Crear nuevo equipo"
          >
            <Plus size={18} aria-hidden="true" />
            <span>Nuevo Equipo</span>
          </button>
        </div>
      </header>

      <StatsCards stats={statsCards} isLoading={isLoading} />

      <section className="mt-8">
        <EquipmentList />
      </section>

      <section className="mt-8" aria-labelledby="loan-section-title">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="loan-section-title"
            className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
          >
            Préstamos
          </h2>
          <button
            onClick={handleOpenLoanModal}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Crear nuevo préstamo"
            disabled={equipmentStats && equipmentStats.available === 0}
            title={
              equipmentStats?.available === 0
                ? 'No hay equipos disponibles para préstamo'
                : 'Crear nuevo préstamo'
            }
          >
            <Plus size={18} aria-hidden="true" />
            <span>Crear Préstamo</span>
          </button>
        </div>
        <LoanList />
      </section>

      <EquipmentModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
      />

      <LoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
      />
    </>
  );
};

export default Equipment;
