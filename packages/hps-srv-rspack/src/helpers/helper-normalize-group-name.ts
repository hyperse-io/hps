import { normalizeEvolveEntryName } from './helper-normalize-entry-map.js';

/**
 * Normalizes the group name based on the project virtual path and index.
 *
 * @param projectVirtualPath - The virtual path of the project.
 * @param index - The index used to generate the group name.
 * @returns The normalized group name.
 */
export const normalizeGroupName = (
  projectVirtualPath: string,
  index: number
): string => {
  const upperCase = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const lowerCase = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i)
  );
  const alphabetArray = [...lowerCase, ...upperCase];

  const time = Math.floor(index / 52);
  const alphabetCode = alphabetArray[index % 52];

  return normalizeEvolveEntryName(
    `${alphabetCode}${time || ''}`,
    projectVirtualPath
  );
};
