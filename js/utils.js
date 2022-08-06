/**
 * Compare two number arrays to see if they are equivalent
 * @param {array} array1 - an array of numbers
 * @param {array} array2 - another array of numbers
 */
export const numberArraysMatch = (array1, array2) => {
  const arr1String = JSON.stringify(array1.sort())
  const arr2String = JSON.stringify(array2.sort())
  return arr1String === arr2String;
}