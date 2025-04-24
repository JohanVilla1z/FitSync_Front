import { Clock, Edit } from 'lucide-react';
import { EntryLog } from '../../../constants';

interface EntryLogTableProps {
  isLoading: boolean;
  entryLogs: EntryLog[];
}

const EntryLogTable = ({ isLoading, entryLogs }: EntryLogTableProps) => {
  // Ensure entryLogs is always an array
  const safeEntryLogs = Array.isArray(entryLogs) ? entryLogs : [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Registro
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {isLoading ? (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-4 text-center whitespace-nowrap text-gray-500 dark:text-gray-400"
              >
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
                <div className="mt-2">Cargando registros...</div>
              </td>
            </tr>
          ) : safeEntryLogs.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-10 text-center whitespace-nowrap text-gray-500 dark:text-gray-400"
              >
                No hay registros de entrada disponibles.
              </td>
            </tr>
          ) : (
            safeEntryLogs.map((log) => (
              <tr
                key={log.logId}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        #{log.logId}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {log.userName} {log.userLastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {log.editable ? (
                    <button
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      title="Editar registro"
                    >
                      <Edit
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      No editable
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EntryLogTable;
