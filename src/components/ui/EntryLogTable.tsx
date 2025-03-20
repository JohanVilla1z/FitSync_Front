import { EntryLog } from "../../constants/entryLog";

interface EntryLogTableProps {
  isLoading: boolean;
  entryLogs: EntryLog[];
}

const EntryLogTable = ({ isLoading, entryLogs }: EntryLogTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 text-left dark:bg-gray-700 dark:text-white">
            <th className="px-4 py-2 border-b dark:border-gray-600">ID</th>
            <th className="px-4 py-2 border-b dark:border-gray-600">
              Fecha y Hora
            </th>
            <th className="px-4 py-2 border-b dark:border-gray-600">Usuario</th>
            <th className="px-4 py-2 border-b dark:border-gray-600">
              Equipos Prestados
            </th>
            <th className="px-4 py-2 border-b dark:border-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Cargando...
              </td>
            </tr>
          ) : entryLogs.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No hay registros disponibles.
              </td>
            </tr>
          ) : (
            entryLogs.map((log) => (
              <tr key={log.logId} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{log.logId}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b">{log.userName}</td>
                <td className="px-4 py-2 border-b">
                  {log.borrowedEquipment.length > 0
                    ? log.borrowedEquipment.join(", ")
                    : "Ninguno"}
                </td>
                <td className="px-4 py-2 border-b">
                  {log.editable ? (
                    <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                      Editar
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm">No editable</span>
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
