import EquipmentList from "../../components/ui/EquipmentList";

const Equipment = () => {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Equipos</h1>
        <p className="text-muted-foreground">
          Bienvenido a la página de Equipos
        </p>
      </header>
      <section>
        <EquipmentList />
      </section>
    </>
  );
};

export default Equipment;
