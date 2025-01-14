// TODO: Better naming for this?
export const safeArrayLength = <T>(collection: T[]) =>
  Array.isArray(collection) ? collection.length : 0;

export const arrayContainsEntries = <T>(collection: T[]) =>
  safeArrayLength(collection) > 0;

// https://stackoverflow.com/questions/5999998/check-if-a-variable-is-of-function-type
export const isFunction = (v: any): v is Function => typeof v === 'function';

export const isLastIndexInArray = <T>(index: number, array: T[]) =>
  index === safeArrayLength(array) - 1;

export const isUndefinedOrNull = (v: any) => v === void 0 || v === null;

export const areAllElementsInArrayDefined = <T>(collection: T[]) =>
  arrayContainsEntries(collection) && collection.every(element => element);

export const isPromise = <T>(value: any): value is Promise<T> =>
  value instanceof Promise;

export const safeObjectKeys = (value): string[] =>
  Boolean(value) ? Object.keys(value) : [];
