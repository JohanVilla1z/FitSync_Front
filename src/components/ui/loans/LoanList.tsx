import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useEquipmentStore } from '../../../store/useEquipmentStore';
import { useLoanStore } from '../../../store/useLoanStore';
import { Modal } from '../Modal';

const LoanList = () => {
  const { loans, isLoading, fetchAllLoans, completeLoan } = useLoanStore();
  const { fetchEquipment, fetchEquipmentStats } = useEquipmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    loanId: null as number | null,
    equipmentName: '',
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchAllLoans(),
          fetchEquipment(),
          fetchEquipmentStats(),
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Error al cargar datos iniciales');
      }
    };

    loadInitialData();
  }, [fetchAllLoans, fetchEquipment, fetchEquipmentStats]);

  const openConfirmModal = (loanId: number, equipmentName: string) => {
    setConfirmModal({
      isOpen: true,
      loanId,
      equipmentName,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      loanId: null,
      equipmentName: '',
    });
  };

  const handleCompleteLoan = async () => {
    if (confirmModal.loanId === null || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await completeLoan(confirmModal.loanId);

      // Actualizar ambos stores después de completar un préstamo
      await Promise.all([fetchEquipment(), fetchEquipmentStats()]);

      toast.success(
        `Préstamo de ${confirmModal.equipmentName} marcado como devuelto`
      );
      closeConfirmModal();
    } catch (error) {
      console.error('Error al completar el préstamo:', error);
      toast.error('Error al completar el préstamo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingLoans = Array.isArray(loans)
    ? loans.filter((loan) => loan.status === 'PENDING')
    : [];
  const returnedLoans = Array.isArray(loans)
    ? loans.filter((loan) => loan.status === 'RETURNED')
    : [];

  return (
    <>
      <article className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Gestión de Préstamos
        </h2>
        {isLoading ? (
          <div
            className="flex justify-center items-center py-8"
            aria-live="polite"
            aria-busy="true"
          >
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
              role="progressbar"
            ></div>
            <span className="sr-only">Cargando préstamos...</span>
          </div>
        ) : (
          <>
            <section className="mb-8" aria-labelledby="pending-loans-title">
              <h3
                id="pending-loans-title"
                className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200"
              >
                Préstamos Pendientes
              </h3>
              {pendingLoans.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No hay préstamos pendientes.
                </p>
              ) : (
                <ul className="space-y-4" role="list">
                  {pendingLoans.map((loan) => (
                    <li
                      key={loan.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <dl className="space-y-2">
                          <div>
                            <dt className="inline font-semibold text-gray-900 dark:text-white">
                              Equipo:{' '}
                            </dt>
                            <dd className="inline text-gray-900 dark:text-white">
                              {loan.equipmentName}
                            </dd>
                          </div>
                          <div>
                            <dt className="inline font-semibold text-gray-700 dark:text-gray-300">
                              Usuario:{' '}
                            </dt>
                            <dd className="inline text-gray-700 dark:text-gray-300">
                              {loan.userName} {loan.userLastName}
                            </dd>
                          </div>
                          <div>
                            <dt className="inline font-semibold text-gray-600 dark:text-gray-400 text-sm">
                              Fecha:{' '}
                            </dt>
                            <dd className="inline text-gray-600 dark:text-gray-400 text-sm">
                              {new Date(loan.loanDate).toLocaleDateString()}
                            </dd>
                          </div>
                        </dl>
                        <button
                          onClick={() =>
                            openConfirmModal(loan.id, loan.equipmentName)
                          }
                          disabled={isSubmitting}
                          className="mt-3 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                        >
                          {isSubmitting
                            ? 'Procesando...'
                            : 'Marcar como Devuelto'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="returned-loans-title">
              <h3
                id="returned-loans-title"
                className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200"
              >
                Préstamos Devueltos
              </h3>
              {returnedLoans.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No hay préstamos devueltos.
                </p>
              ) : (
                <ul className="space-y-4" role="list">
                  {returnedLoans.map((loan) => (
                    <li
                      key={loan.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700"
                    >
                      <dl className="flex flex-col">
                        <div>
                          <dt className="inline font-semibold text-gray-900 dark:text-white">
                            Equipo:{' '}
                          </dt>
                          <dd className="inline text-gray-900 dark:text-white">
                            {loan.equipmentName}
                          </dd>
                        </div>
                        <div>
                          <dt className="inline font-semibold text-gray-700 dark:text-gray-300">
                            Usuario:{' '}
                          </dt>
                          <dd className="inline text-gray-700 dark:text-gray-300">
                            {loan.userName} {loan.userLastName}
                          </dd>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-4">
                          <div>
                            <dt className="inline font-semibold text-gray-600 dark:text-gray-400 text-sm">
                              Préstamo:{' '}
                            </dt>
                            <dd className="inline text-gray-600 dark:text-gray-400 text-sm">
                              {new Date(loan.loanDate).toLocaleDateString()}
                            </dd>
                          </div>
                          {loan.returnDate && (
                            <div>
                              <dt className="inline font-semibold text-gray-600 dark:text-gray-400 text-sm">
                                Devolución:{' '}
                              </dt>
                              <dd className="inline text-gray-600 dark:text-gray-400 text-sm">
                                {new Date(loan.returnDate).toLocaleDateString()}
                              </dd>
                            </div>
                          )}
                        </div>
                      </dl>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </article>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        title="Confirmar devolución"
        size="sm"
      >
        <div className="p-6">
          <p className="mb-6 text-gray-800 dark:text-gray-200">
            ¿Confirmas que el equipo{' '}
            <strong className="text-gray-900 dark:text-white">
              {confirmModal.equipmentName}
            </strong>{' '}
            ha sido devuelto?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeConfirmModal}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleCompleteLoan}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Procesando...
                </span>
              ) : (
                'Confirmar'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoanList;
