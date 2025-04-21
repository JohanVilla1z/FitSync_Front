import { useEffect } from 'react';
import { Role } from '../../../constants';
import { useAuthStore, useEntryLogStore } from '../../../store';
import EntryLogTable from './EntryLogTable';

const EntryLogList = () => {
  const { entryLogs, isLoading, fetchEntryLogs } = useEntryLogStore();
  const { user } = useAuthStore();

  const isAdmin = user?.role?.includes(Role.ADMIN);

  useEffect(() => {
    if (entryLogs.length === 0) {
      fetchEntryLogs(isAdmin);
    }
  }, [entryLogs.length, fetchEntryLogs, isAdmin]);

  return (
    <div>
      <EntryLogTable isLoading={isLoading} entryLogs={entryLogs} />
    </div>
  );
};

export default EntryLogList;
