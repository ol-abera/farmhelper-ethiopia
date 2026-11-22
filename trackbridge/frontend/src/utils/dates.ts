export function fmt(d?: string | Date | null) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Addis_Ababa',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(d));
}
