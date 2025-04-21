import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEquipmentStore } from '../../store';
import { useLoanStore } from '../../store/useLoanStore';
import { Button } from './Button';

interface ReturnLoanButtonProps {
  loanId: number;
}

export const ReturnLoanButton = ({ loanId }: ReturnLoanButtonProps) => {
  const [isReturning, setIsReturning] = useState(false);
  const { completeLoan } = useLoanStore();
  const { fetchEquipment } = useEquipmentStore();

  const handleReturn = async () => {
    if (isReturning) return;

    setIsReturning(true);
    try {
      await completeLoan(loanId);

      await fetchEquipment();

      toast.success('Equipo devuelto correctamente');
    } catch (error) {
      console.error('Error al devolver el equipo:', error);
      toast.error('No se pudo devolver el equipo');
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <Button
      onClick={handleReturn}
      disabled={isReturning}
      size="sm"
      variant="outline"
      className="text-green-600 border-green-600 hover:bg-green-50"
    >
      {isReturning ? (
        <span className="flex items-center">
          <span className="animate-spin mr-2 h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full" />
          Procesando...
        </span>
      ) : (
        'Devolver'
      )}
    </Button>
  );
};
