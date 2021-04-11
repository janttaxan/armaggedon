export const getIsValidNumber = (number: number | string) => {
  if (typeof number === 'string') {
    return !Number.isNaN(parseInt(number, 10));
  } else {
    return !Number.isNaN(number);
  }
};
