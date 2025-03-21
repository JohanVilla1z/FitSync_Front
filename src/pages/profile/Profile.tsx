import { useEffect } from 'react';
import { useAuthStore } from '../../store';
import { useUserProfileStore } from '../../store/useUserProfileStore';
import { getAvatarByRole } from '../../utils';
import { getActiveSinceMessage, getGreeting } from '../../utils/timeUtils';
import { getImcDiagnose } from '../../utils/getImcDiagnose'; // Importar la función

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

  // Generar el diagnóstico del IMC
  const imcDiagnosis = profile.currentIMC
    ? getImcDiagnose(profile.currentIMC)
    : 'No se pudo calcular el diagnóstico del IMC.';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Encabezado */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={getAvatarByRole(user?.role)}
            alt="Avatar"
            className="w-56 h-56 rounded-full mb-4 bg-gray-200 dark:bg-gray-700"
          />
          <h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark">
            {getGreeting()}, {profile.name}!
          </h1>
          <p className="text-muted dark:text-muted-dark">{profile.email}</p>
        </div>

        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-muted dark:text-muted-dark">
              Teléfono
            </p>
            <p className="text-lg text-foreground dark:text-foreground-dark">
              {profile.phone || 'No disponible'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted dark:text-muted-dark">
              Altura
            </p>
            <p className="text-lg text-foreground dark:text-foreground-dark">
              {profile.height ? `${profile.height} m` : 'No disponible'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted dark:text-muted-dark">
              Peso
            </p>
            <p className="text-lg text-foreground dark:text-foreground-dark">
              {profile.weight ? `${profile.weight} kg` : 'No disponible'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted dark:text-muted-dark">
              IMC Actual
            </p>
            <p className="text-lg text-foreground dark:text-foreground-dark">
              {profile.currentIMC
                ? profile.currentIMC.toFixed(2)
                : 'No disponible'}
            </p>
          </div>
        </div>

        {/* Diagnóstico del IMC */}
        <div className="mb-6">
          <p className="text-sm font-medium text-muted dark:text-muted-dark">
            Diagnóstico del IMC
          </p>
          <p className="text-lg text-foreground dark:text-foreground-dark">
            {imcDiagnosis}
          </p>
        </div>

        {/* Fecha de Registro */}
        <div className="mb-6">
          <p className="text-sm font-medium text-muted dark:text-muted-dark">
            Fecha de Registro
          </p>
          <p className="text-lg text-foreground dark:text-foreground-dark">
            {getActiveSinceMessage(profile.registerDate)} ({profile.registerDate})
          </p>
        </div>

        {/* Entrenador */}
        <div className="mb-6">
          <p className="text-sm font-medium text-muted dark:text-muted-dark">
            Entrenador
          </p>
          {profile.trainerName ? (
            <p className="text-lg text-foreground dark:text-foreground-dark">
              {profile.trainerName}
            </p>
          ) : (
            <p className="text-lg text-red-500">
              Aun no tienes un entrenador asignado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;