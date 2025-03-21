/**
 * Devuelve un saludo basado en la hora actual del día.
 * @returns {string} Saludo ("Buenos días", "Buenas tardes", "Buenas noches")
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
};
