export function getDate(inputDate: string): string {
  const date = new Date(inputDate);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
  };
  return date.toLocaleDateString('ru-RU', options) + ' ' + date.getFullYear();
}

export function getTime(inputDate: string): string {
  const date = new Date(inputDate);
  const options: Intl.DateTimeFormatOptions = {
    day: undefined,
    month: undefined,
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleTimeString('ru-RU', options);
}

export function getDateTime(inputDate: string): string {
  return `${getDate(inputDate)}, ${getTime(inputDate)}`;
}
