import TrainerList from '../../components/ui/TrainerList';

const Trainers = () => {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Entrenadores</h1>
        <p className="text-muted-foreground">Información de los entrenadores</p>
      </header>
      <section>
        <TrainerList />
      </section>
    </>
  );
};

export default Trainers;
