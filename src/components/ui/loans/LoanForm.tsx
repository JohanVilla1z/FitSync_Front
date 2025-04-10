import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { User } from '../../../constants/User';
import { Equipment } from '../../../constants/equipment';
import { EquipmentCombobox } from '../EquipmentCombobox';
import { UserCombobox } from '../UserCombobox';

interface LoanFormProps {
  users: User[];
  equipment: Equipment[];
  onSubmit: (data: { userId: string; equipmentId: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const LoanForm = ({
  users,
  equipment,
  onSubmit,
  onCancel,
  isSubmitting,
}: LoanFormProps) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      userId: '',
      equipmentId: '',
    },
  });

  const handleFormSubmit = async (data: {
    userId: string;
    equipmentId: string;
  }) => {
    if (!data.userId || !data.equipmentId) {
      return;
    }

    try {
      await onSubmit(data);
      setSelectedUser(null);
      setSelectedEquipment(null);
      reset();
    } catch (error) {
      console.error('Error in loan form submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <fieldset className="mb-4" disabled={isSubmitting}>
        <legend className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
          Usuario
        </legend>
        <Controller
          name="userId"
          control={control}
          rules={{ required: 'Seleccione un usuario' }}
          render={({ field }) => (
            <UserCombobox
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={(userId) => {
                setSelectedUser(userId);
                field.onChange(userId || '');
              }}
              register={() => {}}
              errors={errors}
            />
          )}
        />
        {errors.userId && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {String(errors.userId.message)}
          </p>
        )}
      </fieldset>

      <fieldset className="mb-4" disabled={isSubmitting}>
        <legend className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
          Equipo
        </legend>
        <Controller
          name="equipmentId"
          control={control}
          rules={{ required: 'Seleccione un equipo' }}
          render={({ field }) => (
            <EquipmentCombobox
              equipment={equipment}
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={(equipmentId) => {
                setSelectedEquipment(equipmentId);
                field.onChange(equipmentId || '');
              }}
              register={() => {}}
              errors={errors}
            />
          )}
        />
        {errors.equipmentId && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {String(errors.equipmentId.message)}
          </p>
        )}
      </fieldset>

      {selectedUser && selectedEquipment && (
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md mb-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Préstamo listo para crear con:
            <br />- Usuario:{' '}
            {users.find((u) => u.id.toString() === selectedUser)?.name ||
              selectedUser}
            <br />- Equipo:{' '}
            {equipment.find((e) => e.id.toString() === selectedEquipment)
              ?.name || selectedEquipment}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !selectedUser || !selectedEquipment}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Creando...
            </>
          ) : (
            'Crear Préstamo'
          )}
        </button>
      </div>
    </form>
  );
};
