import EntryLogList from '../../components/ui/EntryLogList';

function Dashboard() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración de FitSync
        </p>
      </header>

      {/* Tabla de Historial de Entradas */}
      <section className="mb-8">
        <EntryLogList />
      </section>
    </>
  );
}

export default Dashboard;
