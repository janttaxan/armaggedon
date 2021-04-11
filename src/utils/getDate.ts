export function getDate(inputDate: string): string {
  const date = new Date(inputDate);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
  };
  return date.toLocaleDateString('ru-RU', options) + ' ' + date.getFullYear();
}
