import { DoorOpen, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Spinner } from '../../components/ui';
import BasicInfo from '../../components/ui/BasicInfo';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import EntryLogSection from '../../components/ui/EntryLogSection';
import FloatingActionButton from '../../components/ui/FloatingActionButton';
import IMCDiagnosis from '../../components/ui/IMCDiagnosis';
import ProfileEditModal from '../../components/ui/ProfileEditModal';
import ProfileHeader from '../../components/ui/ProfileHeader';
import TrainerInfo from '../../components/ui/TrainerInfo';
import { EntryLog } from '../../constants/entryLog';
import { getUserEntryLogs, registerGymEntry } from '../../services/userService';
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

  // Estados para el modal y el registro de entrada
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );

  // Estado para el modal de edición de perfil
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Obtener perfil de usuario al montar el componente
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Obtener historial de entradas al montar el componente
  useEffect(() => {
    fetchEntryLogs();
  }, []);

  // Función para obtener el historial de entradas
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

  // Función para registrar entrada al gimnasio
  const handleRegisterEntry = async () => {
    try {
      setIsRegistering(true);
      setRegistrationError(null);

      // Llamar al endpoint para registrar entrada
      await registerGymEntry();

      // Cerrar modal de confirmación
      setIsModalOpen(false);

      // Refrescar historial de entradas para mostrar la nueva entrada
      fetchEntryLogs();
    } catch (error: any) {
      console.error('Error al registrar entrada:', error);
      setRegistrationError(
        error.response?.data?.message ||
          'No se pudo registrar la entrada. Inténtalo de nuevo.'
      );
    } finally {
      setIsRegistering(false);
    }
  };

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
    <main className="flex justify-center items-center h-full p-4 relative">
      {/* Contenido principal */}
      <section
        className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        role="region"
        aria-labelledby="profile-header"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex-grow">
            <ProfileHeader user={user} profile={profile} />
          </div>

          {/* Botón de edición del perfil */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            aria-label="Editar perfil"
          >
            <Edit size={18} />
            <span>Editar Perfil</span>
          </button>
        </div>

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

        {/* Mostrar error de registro si existe */}
        {registrationError && (
          <div
            className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
            role="alert"
          >
            <p>{registrationError}</p>
          </div>
        )}
      </section>

      {/* Botón flotante para registrar entrada */}
      <FloatingActionButton
        onClick={() => setIsModalOpen(true)}
        label="Registrar entrada al gimnasio"
        icon={<DoorOpen className="h-6 w-6" />}
      />

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleRegisterEntry}
        title="Confirmar entrada al gimnasio"
        message="¿Estás seguro de que quieres registrar tu entrada al gimnasio ahora?"
        confirmText={isRegistering ? 'Registrando...' : 'Confirmar entrada'}
        cancelText="Cancelar"
      />

      {/* Modal de edición de perfil */}
      {profile && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
        />
      )}
    </main>
  );
};

export default Profile;
