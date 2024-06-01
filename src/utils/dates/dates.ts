import { add as addFns, compareAsc, parseISO } from 'date-fns';
import type { Duration } from 'date-fns/types';

export function add(date: Date | number | string, duration: Duration) {
  return addFns(date, duration).toISOString();
}

export const getCurrentDate = () => {
  return new Date().toISOString();
};

export function isExpiredDate(expirationDate: string, currentDate: string): boolean {
  const comparisonResult = compareAsc(parseISO(expirationDate), parseISO(currentDate));

  // Если дата истечения равна текущей дате, считаем, что она истекла
  if (comparisonResult === 0) {
    return true;
  }
  // Если дата истечения раньше текущей даты, значит она истекла
  if (comparisonResult < 0) {
    return true;
  }
  // Если дата истечения позже текущей даты, значит она не истекла

  return false;
}
