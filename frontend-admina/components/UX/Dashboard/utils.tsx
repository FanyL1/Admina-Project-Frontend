export const getAcademicPeriod = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Enero es 0

  // Periodo X-1: Marzo a Julio (incluidos)
  if (month >= 3 && month <= 7) {
    return `${year}-1`;
  }
  
  // Periodo X-3: Agosto a Septiembre (incluidos)
  if (month >= 8 && month <= 9) {
    return `${year}-3`;
  }

  // Periodo X-2: Octubre a Febrero (Cruza de año)
  if (month >= 10) {
    return `${year}-2`;
  } else {
    return `${year - 1}-2`;
  }
};

export const formatDate = (value: string) => new Date(value).toLocaleString('es-VE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});