import { useEffect } from 'react';
import { useLoanStore } from '../../../store/useLoanStore';

const LoanList = () => {
  const { loans, isLoading, fetchAllLoans, completeLoan } = useLoanStore();

  useEffect(() => {
    fetchAllLoans();
  }, [fetchAllLoans]);

  const handleCompleteLoan = async (loanId: number) => {
    try {
      await completeLoan(loanId);
      alert('Préstamo marcado como devuelto.');
    } catch (error) {
      alert('Error al completar el préstamo.');
    }
  };

  const pendingLoans = Array.isArray(loans)
    ? loans.filter((loan) => loan.status === 'PENDING')
    : [];
  const returnedLoans = Array.isArray(loans)
    ? loans.filter((loan) => loan.status === 'RETURNED')
    : [];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Gestión de Préstamos</h2>
      {isLoading ? (
        <p className="text-gray-600">Cargando préstamos...</p>
      ) : (
        <>
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Préstamos Pendientes</h3>
            {pendingLoans.length === 0 ? (
              <p className="text-gray-600">No hay préstamos pendientes.</p>
            ) : (
              <ul className="space-y-4">
                {pendingLoans.map((loan) => (
                  <li
                    key={loan.id}
                    className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700"
                  >
                    <p>
                      <strong>Usuario:</strong> {loan.userName}{' '}
                      {loan.userLastName}
                    </p>
                    <p>
                      <strong>Equipo:</strong> {loan.equipmentName}
                    </p>
                    <p>
                      <strong>Fecha de Préstamo:</strong> {loan.loanDate}
                    </p>
                    <button
                      onClick={() => handleCompleteLoan(loan.id)}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Marcar como Devuelto
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Préstamos Devueltos</h3>
            {returnedLoans.length === 0 ? (
              <p className="text-gray-600">No hay préstamos devueltos.</p>
            ) : (
              <ul className="space-y-4">
                {returnedLoans.map((loan) => (
                  <li
                    key={loan.id}
                    className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700"
                  >
                    <p>
                      <strong>Usuario:</strong> {loan.userName}{' '}
                      {loan.userLastName}
                    </p>
                    <p>
                      <strong>Equipo:</strong> {loan.equipmentName}
                    </p>
                    <p>
                      <strong>Fecha de Préstamo:</strong> {loan.loanDate}
                    </p>
                    <p>
                      <strong>Fecha de Devolución:</strong> {loan.returnDate}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default LoanList;
