import { Box } from 'lucide-react';
import EquipmentList from '../../components/ui/EquipmentList';

const Equipment = () => {
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
          <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Box size={18} />
            <span>Nuevo Equipo</span>
          </button>
        </div>
      </header>

      {/* Estadísticas rápidas */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total Equipos
          </h3>
          <p className="text-2xl font-bold">48</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Disponibles
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            32
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            En préstamo
          </h3>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            16
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            No disponibles
          </h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">4</p>
        </div>
      </section>

      <section>
        <EquipmentList />
      </section>
    </>
  );
};

export default Equipment;
