interface IMCDiagnosisProps {
  diagnosis: string;
  imc: number | null;
}

const IMCDiagnosis = ({ diagnosis, imc }: IMCDiagnosisProps) => {
  // Determinar la clase de color basada en el IMC
  const getStatusColor = () => {
    if (!imc) return 'bg-gray-50 border-gray-300 text-gray-800';

    if (imc < 18.5) return 'bg-blue-50 border-blue-300 text-blue-800'; // Bajo peso
    if (imc < 25) return 'bg-green-50 border-green-300 text-green-800'; // Normal
    if (imc < 30) return 'bg-yellow-50 border-yellow-300 text-yellow-800'; // Sobrepeso
    return 'bg-red-50 border-red-300 text-red-800'; // Obesidad
  };

  return (
    <section aria-labelledby="imc-diagnosis-header" className="mb-6">
      <h2
        id="imc-diagnosis-header"
        className="text-2xl font-semibold text-foreground dark:text-foreground-dark mb-4"
      >
        Diagnóstico del IMC
      </h2>
      <div className={`${getStatusColor()} border p-4 rounded-md`}>
        <p className="text-lg font-medium">{diagnosis}</p>
        {imc && (
          <p className="text-sm mt-2">Tu IMC actual es {imc.toFixed(2)}.</p>
        )}
      </div>
    </section>
  );
};

export default IMCDiagnosis;
