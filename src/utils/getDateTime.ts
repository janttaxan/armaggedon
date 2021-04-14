export function getDate(inputDate: number | string): string {
  const date = new Date(inputDate);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
  };
  return date.toLocaleDateString('ru-RU', options) + ' ' + date.getFullYear();
}

export function getTime(inputDate: number | string): string {
  const date = new Date(inputDate);
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleTimeString('ru-RU', options);
}

export function getDateTime(inputDate: number | string): string {
  return `${getDate(inputDate)}, ${getTime(inputDate)}`;
}
