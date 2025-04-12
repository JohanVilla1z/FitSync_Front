import { DoorOpen } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Role } from '../../../constants';
import { EntryLog } from '../../../constants/entryLog';
import { useEntryLogs } from '../../../hooks/useEntryLogs';
import { UserProfile } from '../../../store/useUserProfileStore';
import { getImcDiagnose } from '../../../utils';
import BasicInfo from '../BasicInfo';
import ConfirmationModal from '../ConfirmationModal';
import FloatingActionButton from '../FloatingActionButton';
import TrainerInfo from '../TrainerInfo';
import EntryLogSection from '../entryLogs/EntryLogSection';
import IMCDiagnosis from './IMCDiagnosis';

interface UserProfileContentProps {
  profile: UserProfile;
  userRole: string;
}

function UserProfileContent({ profile, userRole }: UserProfileContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Valores por defecto para los datos de entry logs
  const defaultEntryLogsData = {
    entryLogs: [] as EntryLog[],
    isLoadingLogs: false,
    errorLogs: null as null | { message: string },
    isRegistering: false,
    registrationError: null as null | { message: string },
    registerEntry: async () => false,
    fetchEntryLogs: async () => [] as EntryLog[],
    isSuccess: false,
    todayEntries: 0,
    yesterdayEntries: 0,
    isAdminView: false,
    canAccessAdminView: false,
    clearRegistrationError: () => {},
    clearLogsError: () => {},
    toggleAdminView: () => {},
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
    clearRegistrationError,
  } = entryLogsData;

  const handleRegisterEntry = async () => {
    if (userRole === Role.USER && registerEntry) {
      try {
        clearRegistrationError();

        const success = await registerEntry();

        if (success) {
          setIsModalOpen(false);
          toast.success('Entrada registrada correctamente');
        }
      } catch (error) {
        console.error('Error al registrar entrada:', error);
      }
    }
  };

  const formatErrorMessage = (error: any): string => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (error.message && typeof error.message === 'string')
      return error.message;
    return 'Error desconocido';
  };

  return (
    <div className="space-y-6">
      <BasicInfo profile={profile} />

      {(profile.trainerName || profile.trainerEmail) && (
        <TrainerInfo
          trainerName={profile.trainerName || ''}
          trainerEmail={profile.trainerEmail || ''}
        />
      )}

      {profile.currentIMC && (
        <IMCDiagnosis
          diagnosis={getImcDiagnose(profile.currentIMC)}
          imc={profile.currentIMC}
        />
      )}

      <EntryLogSection
        entryLogs={entryLogs}
        isLoading={isLoadingLogs}
        error={errorLogs ? formatErrorMessage(errorLogs) : null}
      />

      {registrationError && (
        <div
          className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <p>{formatErrorMessage(registrationError)}</p>
        </div>
      )}

      {userRole === Role.USER && (
        <FloatingActionButton
          onClick={() => setIsModalOpen(true)}
          label="Registrar entrada al gimnasio"
          icon={<DoorOpen className="h-6 w-6" />}
          disabled={isRegistering}
        />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleRegisterEntry}
        title="Confirmar entrada al gimnasio"
        message="¿Estás seguro de que quieres registrar tu entrada al gimnasio ahora?"
        confirmText={isRegistering ? 'Registrando...' : 'Confirmar entrada'}
        cancelText="Cancelar"
        isDisabled={isRegistering}
      />
    </div>
  );
}

export default UserProfileContent;
