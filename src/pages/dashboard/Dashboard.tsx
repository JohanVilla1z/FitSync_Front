import { BarChart2, Clock } from 'lucide-react';
import { DashboardStats } from '../../components/ui/dashboard/DashboardStats';
import EntryLogList from '../../components/ui/entryLogs/EntryLogList';

function Dashboard() {
  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 size={28} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Bienvenido al panel de administración de FitSync
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <BarChart2 size={18} />
            <span>Estadísticas</span>
          </button>
        </div>
      </header>

      <DashboardStats />

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-blue-600 dark:text-blue-400" size={20} />
          <h2 className="text-xl font-semibold">Historial de Entradas</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <EntryLogList />
        </div>
      </section>
    </>
  );
}

export default Dashboard;
