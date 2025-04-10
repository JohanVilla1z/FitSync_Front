import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { User } from '../../../constants/User';
import { EquipmentCombobox } from '../EquipmentCombobox';
import { UserCombobox } from '../UserCombobox';

interface LoanFormProps {
  users: User[];
  equipment: any[];
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
  } = useForm({
    defaultValues: {
      userId: '',
      equipmentId: '',
    },
  });

  const validUsers = Array.isArray(users) ? users : [];
  const validEquipment = Array.isArray(equipment) ? equipment : [];

  const handleUserChange = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleEquipmentChange = (equipmentId: string) => {
    setSelectedEquipment(equipmentId);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <fieldset className="mb-4">
        <legend className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
          Usuario
        </legend>
        <Controller
          name="userId"
          control={control}
          rules={{ required: 'Seleccione un usuario' }}
          render={({ field }) => (
            <UserCombobox
              users={validUsers}
              selectedUser={selectedUser}
              setSelectedUser={(userId) => {
                handleUserChange(userId || '');
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

      <fieldset className="mb-4">
        <legend className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
          Equipo
        </legend>
        <Controller
          name="equipmentId"
          control={control}
          rules={{ required: 'Seleccione un equipo' }}
          render={({ field }) => (
            <EquipmentCombobox
              equipment={validEquipment}
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={(equipmentId) => {
                handleEquipmentChange(equipmentId || '');
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

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !selectedUser || !selectedEquipment}
          aria-busy={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isSubmitting ? 'Creando...' : 'Crear Préstamo'}
        </button>
      </div>
    </form>
  );
};
