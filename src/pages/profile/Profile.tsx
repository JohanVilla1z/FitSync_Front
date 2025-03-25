import { useEffect } from 'react';
import { useAuthStore, useUserProfileStore } from '../../store';
import {
  getActiveSinceMessage,
  getAvatarByRole,
  getGreeting,
  getImcDiagnose,
} from '../../utils';

const Profile = () => {
  const { user } = useAuthStore();
  const { profile, isLoading, fetchUserProfile } = useUserProfileStore();

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (isLoading) {
    return (
      <p className="text-center text-foreground dark:text-foreground-dark">
        Cargando...
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="text-center text-red-500">No se pudo cargar el perfil.</p>
    );
  }

  const imcDiagnosis = profile.currentIMC
    ? getImcDiagnose(profile.currentIMC)
    : 'No se pudo calcular el diagnóstico del IMC.';

  return (
    <section
      className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      role="region"
      aria-labelledby="profile-header"
    >
      {/* Encabezado */}
      <header className="flex flex-col items-center mb-6">
        <img
          src={getAvatarByRole(user?.role)}
          alt={`Avatar del usuario con rol ${user?.role}`}
          className="w-56 h-56 rounded-full mb-4 bg-gray-200 dark:bg-white"
        />
        <h1
          id="profile-header"
          className="text-3xl font-bold text-foreground dark:text-foreground-dark"
        >
          {getGreeting()}, {profile.name}!
        </h1>
        <p className="text-muted dark:text-muted-dark">{profile.email}</p>
      </header>

      {/* Información Básica */}
      <section aria-labelledby="basic-info-header" className="mb-6">
        <h2
          id="basic-info-header"
          className="text-2xl font-semibold text-foreground dark:text-foreground-dark"
        >
          Información Básica
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li>
            <p className="text-sm font-medium text-muted dark:text-muted-dark">
              Teléfono
            </p>
            <p className="text-lg text-foreground dark:text-foreground-dark">
              {profile.phone || 'No disponible'}
            </p>
          </li>
          <li>
            <p className="text-sm font-medium text-muted dark:text-muted-dark">
              Altura
            </p>
            <p className="text-lg text-foreground dark:text-foreground-dark">
              {profile.height ? `${profile.height} m` : 'No disponible'}
            </p>
          </li>
          <li>
            <p className="text-sm font-medium text-muted dark:text-muted-dark">
              Peso
            </p>
            <p className="text-lg text-foreground dark:text-foreground-dark">
              {profile.weight ? `${profile.weight} kg` : 'No disponible'}
            </p>
          </li>
          <li>
            <p className="text-sm font-medium text-muted dark:text-muted-dark">
              IMC Actual
            </p>
            <p className="text-lg text-foreground dark:text-foreground-dark">
              {profile.currentIMC
                ? profile.currentIMC.toFixed(2)
                : 'No disponible'}
            </p>
          </li>
        </ul>
      </section>

      {/* Diagnóstico del IMC */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground dark:text-foreground-dark">
          Diagnóstico del IMC
        </h2>
        <p className="text-lg text-foreground dark:text-foreground-dark">
          {imcDiagnosis}
        </p>
      </section>

      {/* Fecha de Registro */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground dark:text-foreground-dark">
          Fecha de Registro
        </h2>
        <p className="text-lg text-foreground dark:text-foreground-dark">
          {getActiveSinceMessage(profile.registerDate)} ({profile.registerDate})
        </p>
      </section>

      {/* Entrenador */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground dark:text-foreground-dark">
          Entrenador
        </h2>
        {profile.trainerName ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li>
              <p className="text-sm font-medium text-muted dark:text-muted-dark">
                Nombre
              </p>
              <p className="text-lg text-foreground dark:text-foreground-dark">
                {profile.trainerName || 'No disponible'}
              </p>
            </li>
            <li>
              <p className="text-sm font-medium text-muted dark:text-muted-dark">
                Correo Electrónico
              </p>
              <p className="text-lg text-foreground dark:text-foreground-dark">
                {profile.trainerEmail || 'No disponible'}
              </p>
            </li>
          </ul>
        ) : (
          <p className="text-lg text-red-500">
            Aún no tienes un entrenador asignado.
          </p>
        )}
      </section>
    </section>
  );
};

export default Profile;
