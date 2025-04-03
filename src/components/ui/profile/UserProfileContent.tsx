import { useState } from 'react';
import { Role } from '../../../constants';
import { DoorOpen } from 'lucide-react';
import BasicInfo from '../BasicInfo';
import TrainerInfo from '../TrainerInfo';
import IMCDiagnosis from '../IMCDiagnosis';
import EntryLogSection from '../EntryLogSection';
import ConfirmationModal from '../ConfirmationModal';
import FloatingActionButton from '../FloatingActionButton';
import { useEntryLogs } from '../../../hooks/useEntryLogs';
import { getImcDiagnose } from '../../../utils';
import { User } from '../../../constants/User';
import { EntryLog } from '../../../constants/entryLog';

// Definimos explícitamente las props
interface UserProfileContentProps {
  profile: User;
  userRole: string;
}

// Exportamos de forma predeterminada
export default function UserProfileContent({
  profile,
  userRole,
}: UserProfileContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Valores por defecto para los datos de entry logs
  const defaultEntryLogsData = {
    entryLogs: [] as EntryLog[],
    isLoadingLogs: false,
    errorLogs: null as string | null,
    isRegistering: false,
    registrationError: null as string | null,
    registerEntry: async () => false,
    fetchEntryLogs: async () => {},
  };

  // Usar el hook personalizado solo si es usuario regular
  const entryLogsData =
    userRole === Role.USER ? useEntryLogs() : defaultEntryLogsData;

  const {
    entryLogs,
    isLoadingLogs,
    errorLogs,
    isRegistering,
    registrationError,
    registerEntry,
  } = entryLogsData;

  // Función para manejar el registro de entrada con verificación
  const handleRegisterEntry = async () => {
    if (userRole === Role.USER && registerEntry) {
      const success = await registerEntry();
      if (success) {
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <BasicInfo profile={profile} />

      {userRole === Role.USER && (
        <>
          <TrainerInfo
            trainerName={profile.trainerName}
            trainerEmail={profile.trainerEmail}
          />

          {profile.currentIMC && (
            <IMCDiagnosis
              diagnosis={getImcDiagnose(profile.currentIMC)}
              imc={profile.currentIMC}
            />
          )}

          <EntryLogSection
            entryLogs={entryLogs}
            isLoading={isLoadingLogs}
            error={errorLogs}
          />

          {registrationError && (
            <div
              className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
              role="alert"
            >
              <p>{registrationError}</p>
            </div>
          )}

          {/* UI para registro de entrada */}
          <FloatingActionButton
            onClick={() => setIsModalOpen(true)}
            label="Registrar entrada al gimnasio"
            icon={<DoorOpen className="h-6 w-6" />}
          />

          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleRegisterEntry}
            title="Confirmar entrada al gimnasio"
            message="¿Estás seguro de que quieres registrar tu entrada al gimnasio ahora?"
            confirmText={isRegistering ? 'Registrando...' : 'Confirmar entrada'}
            cancelText="Cancelar"
          />
        </>
      )}
    </div>
  );
}
