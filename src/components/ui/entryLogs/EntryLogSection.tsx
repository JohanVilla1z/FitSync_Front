import { EntryLog } from '../../../constants';
import EntryLogTable from './EntryLogTable';

interface EntryLogSectionProps {
  entryLogs: EntryLog[];
  isLoading: boolean;
  error: string | null;
}

const EntryLogSection = ({
  entryLogs,
  isLoading,
  error,
}: EntryLogSectionProps) => (
  <section aria-labelledby="entry-log-header" className="mb-6">
    <h2
      id="entry-log-header"
      className="text-2xl font-semibold text-foreground dark:text-foreground-dark mb-4"
    >
      Historial de Entradas
    </h2>
    <EntryLogTable isLoading={isLoading} entryLogs={entryLogs} />
    {error && (
      <div
        className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
        role="alert"
      >
        <p>{error}</p>
      </div>
    )}
  </section>
);

export default EntryLogSection;
