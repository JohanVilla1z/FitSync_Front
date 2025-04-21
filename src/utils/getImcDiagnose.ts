/**
 * Genera un diagnóstico en lenguaje natural basado en el valor del IMC.
 * @param {number} imc - El valor del Índice de Masa Corporal (IMC).
 * @returns {string} Diagnóstico en lenguaje natural.
 */
export const getImcDiagnose = (imc: number): string => {
  if (imc < 16) {
    return 'Se encuentra en un estado de delgadez severa. Es importante buscar atención médica para evaluar su salud.';
  } else if (imc >= 16 && imc < 17) {
    return 'Se encuentra en un estado de delgadez moderada. Considere consultar a un profesional de la salud.';
  } else if (imc >= 17 && imc < 18.5) {
    return 'Se encuentra en un estado de delgadez leve. Mantener una dieta equilibrada puede ayudar.';
  } else if (imc >= 18.5 && imc < 25) {
    return 'Tiene un peso normal. ¡Siga manteniendo un estilo de vida saludable!';
  } else if (imc >= 25 && imc < 30) {
    return 'Se encuentra en un estado de sobrepeso. Considere realizar actividad física regularmente y mantener una dieta equilibrada.';
  } else if (imc >= 30 && imc < 35) {
    return 'Se encuentra en un estado de obesidad grado I. Es recomendable buscar orientación médica para mejorar su salud.';
  } else if (imc >= 35 && imc < 40) {
    return 'Se encuentra en un estado de obesidad grado II. Es importante buscar ayuda médica para prevenir complicaciones.';
  } else {
    return 'Se encuentra en un estado de obesidad grado III (obesidad mórbida). Es crucial buscar atención médica especializada.';
  }
};
