export function formatNumber(value, locale = 'pt-BR') {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value ?? 0);
}

export function formatDate(value, locale = 'pt-BR') {
  if (!value) return '—';
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}
