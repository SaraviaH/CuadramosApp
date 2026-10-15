/**
 * Iniciales para avatares: usa las dos primeras palabras (Ana Pérez -> AP);
 * si solo hay una palabra, sus dos primeras letras. Nunca devuelve vacío.
 */
export const getInitials = (name: string): string => {
  const clean = (name || '').trim();
  if (!clean) return 'CP';
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || 'CP';
};

export const formatAmount = (amount: number, decimals = 2): string => {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const isNegative = safeAmount < 0;
  const abs = Math.abs(safeAmount);
  const parts = abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${isNegative ? '− ' : ''}S/ ${parts}`;
};

export const formatCurrency = (amount: number): string => formatAmount(amount, 2);

export const formatSignedCurrency = (
  amount: number,
  tone: 'income' | 'expense' | 'neutral',
): string => {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const abs = Math.abs(safeAmount);
  const parts = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const value = `S/ ${parts}`;
  if (tone === 'income') return `+ ${value}`;
  if (tone === 'expense') return `− ${value}`;
  return safeAmount < 0 ? `− ${value}` : value;
};

export const formatDate = (value: string): string => {
  try {
    return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
  } catch {
    return value;
  }
};

export const formatTime = (value: string): string => {
  try {
    return new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
  } catch {
    return value;
  }
};

export const formatFriendlyTime = (date = new Date()): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
};

export const formatFriendlyDate = (date = new Date()): string => {
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  return `Hoy, ${day} de ${month}`;
};

