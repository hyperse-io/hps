import { globby } from 'globby';

/**
 * Prepare the files to upload
 * @param lookupCwd the cwd to lookup the files
 * @param matchPatterns the match patterns to lookup the files
 * @param ignorePatterns the ignore patterns to exclude the files
 * @returns the files with absolute path to upload
 */
export const prepareUploadFiles = async (
  lookupCwd: string,
  matchPatterns: string[],
  ignorePatterns: string[]
): Promise<string[]> => {
  const ruledFiles: Set<string> = new Set();

  for (const filter of matchPatterns) {
    // handle file /xx/yyy/xx.jpg or /xx/yyy/**
    const matchedFiles = await globby(filter, {
      absolute: true,
      dot: true,
      unique: true,
      ignore: [...ignorePatterns, '**/__MACOSX/**', '**/*.DS_Store'],
      cwd: lookupCwd,
    });
    matchedFiles.forEach((file) => {
      ruledFiles.add(file);
    });
  }

  return Array.from(ruledFiles);
};
