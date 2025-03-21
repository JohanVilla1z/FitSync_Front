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

// Función para calcular el tiempo transcurrido desde la fecha de registro
export const getActiveSinceMessage = (registerDate: string): string => {
  const now = new Date();
  const registeredDate = new Date(registerDate);
  const diffInMs = now.getTime() - registeredDate.getTime();

  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    const remainingMonths = months % 12;
    return `Activo desde hace ${years} año${years > 1 ? 's' : ''} y ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
  } else if (months > 0) {
    const remainingDays = days % 30;
    return `Activo desde hace ${months} mes${months > 1 ? 'es' : ''} y ${remainingDays} día${remainingDays > 1 ? 's' : ''}`;
  } else {
    return `Activo desde hace ${days} día${days > 1 ? 's' : ''}`;
  }
};
