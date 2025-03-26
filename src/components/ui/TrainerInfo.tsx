interface TrainerInfoProps {
  trainerName?: string | null;
  trainerEmail?: string | null;
}

/**
 * Componente que muestra la información del entrenador asignado al usuario
 */
const TrainerInfo = ({ trainerName, trainerEmail }: TrainerInfoProps) => {
  return (
    <section
      className="mb-6"
      role="complementary"
      aria-labelledby="trainer-info-header"
    >
      <h2
        id="trainer-info-header"
        className="text-2xl font-semibold text-foreground dark:text-foreground-dark mb-4"
      >
        Entrenador
      </h2>
      {trainerName ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li>
            <p className="text-sm font-medium text-muted dark:text-muted-dark">
              Nombre
            </p>
            <p className="text-lg text-foreground dark:text-foreground-dark">
              {trainerName || 'No disponible'}
            </p>
          </li>
          <li>
            <p className="text-sm font-medium text-muted dark:text-muted-dark">
              Correo Electrónico
            </p>
            <p className="text-lg text-foreground dark:text-foreground-dark">
              {trainerEmail || 'No disponible'}
            </p>
          </li>
        </ul>
      ) : (
        <p className="text-lg text-red-500">
          Aún no tienes un entrenador asignado.
        </p>
      )}
    </section>
  );
};

export default TrainerInfo;
