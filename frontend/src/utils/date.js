export function format(date) {
  if (!(date instanceof Date) || Number.isNaN(date.valueOf())) {
    return '';
  }
  return date.toISOString().slice(0, 10);
}
