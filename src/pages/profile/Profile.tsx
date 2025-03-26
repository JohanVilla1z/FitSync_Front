import { useEffect, useState } from 'react';
import { Spinner } from '../../components/ui';
import BasicInfo from '../../components/ui/BasicInfo';
import EntryLogSection from '../../components/ui/EntryLogSection';
import IMCDiagnosis from '../../components/ui/IMCDiagnosis';
import ProfileHeader from '../../components/ui/ProfileHeader';
import TrainerInfo from '../../components/ui/TrainerInfo';
import { EntryLog } from '../../constants/entryLog';
import { getUserEntryLogs } from '../../services/userService';
import { useAuthStore, useUserProfileStore } from '../../store';
import { getImcDiagnose } from '../../utils';

/**
 * Componente principal del perfil de usuario
 * Muestra información personal, diagnóstico IMC y historial de entradas
 */
const Profile = () => {
  // Obtener datos de los stores globales
  const { user } = useAuthStore();
  const {
    profile,
    isLoading: isLoadingProfile,
    fetchUserProfile,
  } = useUserProfileStore();

  // Estados locales para el historial de entradas
  const [entryLogs, setEntryLogs] = useState<EntryLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [errorLogs, setErrorLogs] = useState<string | null>(null);

  // Obtener perfil de usuario al montar el componente
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Obtener historial de entradas al montar el componente
  useEffect(() => {
    const fetchEntryLogs = async () => {
      try {
        setIsLoadingLogs(true);
        setErrorLogs(null);

        const logs = await getUserEntryLogs();
        setEntryLogs(logs);
      } catch (error) {
        console.error('Error al cargar historial de entradas:', error);
        setErrorLogs('No se pudo cargar el historial de entradas.');
      } finally {
        setIsLoadingLogs(false);
      }
    };

    fetchEntryLogs();
  }, []);

  // Mostrar spinner mientras se carga el perfil
  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <Spinner className="h-12 w-12 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de error si no se pudo cargar el perfil
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <p className="font-medium">No se pudo cargar el perfil.</p>
          <p>Por favor, intenta recargar la página o contacta a soporte.</p>
        </div>
      </div>
    );
  }

  // Calcular diagnóstico IMC
  const imcDiagnosis = profile.currentIMC
    ? getImcDiagnose(profile.currentIMC)
    : 'No se pudo calcular el diagnóstico del IMC.';

  return (
    <main className="flex justify-center items-center h-full p-4">
      <section
        className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        role="region"
        aria-labelledby="profile-header"
      >
        <ProfileHeader user={user} profile={profile} />

        <BasicInfo profile={profile} />

        <TrainerInfo
          trainerName={profile.trainerName}
          trainerEmail={profile.trainerEmail}
        />

        <IMCDiagnosis diagnosis={imcDiagnosis} imc={profile.currentIMC} />

        <EntryLogSection
          entryLogs={entryLogs}
          isLoading={isLoadingLogs}
          error={errorLogs}
        />
      </section>
    </main>
  );
};

export default Profile;
