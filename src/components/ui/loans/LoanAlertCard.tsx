import { useEffect } from 'react';
import { useLoanStore } from '../../../store/useLoanStore';

const LoanAlertCard = ({ userId }: { userId: number }) => {
  const { userLoans, fetchUserLoans } = useLoanStore();

  useEffect(() => {
    fetchUserLoans(userId);
  }, [fetchUserLoans, userId]);

  const pendingLoans = userLoans.filter((loan) => loan.status === 'PENDING');

  if (pendingLoans.length === 0) return null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
      <p>
        Tienes {pendingLoans.length} préstamo
        {pendingLoans.length > 1 ? 's' : ''} pendiente
        {pendingLoans.length > 1 ? 's' : ''} por devolver.
      </p>
    </div>
  );
};

export default LoanAlertCard;
