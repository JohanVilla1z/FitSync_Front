import { BarChart2, Clock, Users, Activity } from 'lucide-react';
import EntryLogList from '../../components/ui/EntryLogList';

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
            <Activity size={18} />
            <span>Estadísticas</span>
          </button>
        </div>
      </header>

      {/* Tarjetas de resumen */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold">Usuarios activos</h2>
          </div>
          <p className="text-3xl font-bold">245</p>
          <p className="text-green-600 dark:text-green-400 text-sm mt-2 flex items-center gap-1">
            <span>↑ 12%</span> 
            <span className="text-gray-500 dark:text-gray-400">desde el mes pasado</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
              <Clock size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold">Entradas de hoy</h2>
          </div>
          <p className="text-3xl font-bold">32</p>
          <p className="text-green-600 dark:text-green-400 text-sm mt-2 flex items-center gap-1">
            <span>↑ 8%</span> 
            <span className="text-gray-500 dark:text-gray-400">comparado con ayer</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <Activity size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold">Tasa de retención</h2>
          </div>
          <p className="text-3xl font-bold">87%</p>
          <p className="text-green-600 dark:text-green-400 text-sm mt-2 flex items-center gap-1">
            <span>↑ 3%</span> 
            <span className="text-gray-500 dark:text-gray-400">desde el mes pasado</span>
          </p>
        </div>
      </section>

      {/* Tabla de Historial de Entradas */}
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