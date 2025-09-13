import { arrayFlatten } from '../array/array-flatten.js';
import { arrayUnique } from '../array/array-unique.js';

/**
 * normalize yargs --filter --modules option into standard RegExp patterns
 * @param option The given yargs -f (--filter) = "a;b;c"
 */
export const normalizeSemicolonFilterParts = (
  option: Array<string | RegExp>
): Array<string | RegExp> => {
  const semicolonParts = arrayFlatten<Array<string | RegExp>>(
    option.map((item) => {
      if (typeof item === 'string') {
        return item
          .split(/\s*;\s*/)
          .filter(Boolean)
          .map((s) => s.trim());
      }
      return item;
    })
  ).filter(Boolean);

  return arrayUnique(semicolonParts);
};
