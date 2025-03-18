import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { EntryLog } from "../../constants/entryLog";
import EntryLogTable from "./EntryLogTable";

const EntryLogList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [entryLogs, setEntryLogs] = useState<EntryLog[]>([]);

  useEffect(() => {
    const fetchEntryLogs = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<EntryLog[]>("/entry-logs/all");
        setEntryLogs(response.data);
      } catch (error) {
        console.error("Error fetching entry logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntryLogs();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Historial de Entradas</h2>
      <EntryLogTable isLoading={isLoading} entryLogs={entryLogs} />
    </div>
  );
};

export default EntryLogList;
