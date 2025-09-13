/**
 * Module for returning arrays with a specific length by padding values.
 * @param array The array to pad.
 * @param length The padding length.
 * @param chars The string used as padding.
 * @returns
 */
export function arrayPad<T = string>(
  array: Array<T>,
  length: number,
  chars: T
) {
  if (array.length < length) {
    // [10.02.20] Fixed error that Dimitry K noticed

    while (true) {
      if (array.push(chars) >= length) {
        break;
      }
    }
  }
  return array;
}
