import { globby } from 'globby';

/**
 * Configuration options for file preparation
 */
export interface PrepareUploadFilesOptions {
  /** The working directory to lookup files from */
  lookupCwd: string;
  /** Patterns to match files (glob patterns) */
  matchPatterns: string[];
  /** Patterns to ignore files (glob patterns) */
  ignorePatterns: string[];
}

/**
 * Default ignore patterns that are always applied
 */
const DEFAULT_IGNORE_PATTERNS = [
  '**/__MACOSX/**',
  '**/*.DS_Store',
  '**/node_modules/**',
  '**/.git/**',
];

/**
 * Prepares files for upload by matching patterns and filtering out ignored files
 *
 * @param options - Configuration options for file preparation
 * @returns Promise resolving to an array of absolute file paths to upload
 *
 * @example
 * ```typescript
 * const files = await prepareUploadFiles({
 *   lookupCwd: '/path/to/project',
 *   matchPatterns: ['dist/**\/*', 'public\/**\/*'],
 *   ignorePatterns: ['**\/*.map', '**\/*.log']
 * });
 * ```
 */
export const prepareUploadFiles = async (
  options: PrepareUploadFilesOptions
): Promise<string[]> => {
  const { lookupCwd, matchPatterns, ignorePatterns } = options;

  // Validate inputs
  if (!lookupCwd || typeof lookupCwd !== 'string') {
    throw new TypeError('lookupCwd must be a non-empty string');
  }

  if (!Array.isArray(matchPatterns) || matchPatterns.length === 0) {
    throw new TypeError('matchPatterns must be a non-empty array');
  }

  if (!Array.isArray(ignorePatterns)) {
    throw new TypeError('ignorePatterns must be an array');
  }

  // Combine default and custom ignore patterns
  const allIgnorePatterns = [...DEFAULT_IGNORE_PATTERNS, ...ignorePatterns];

  // Use Set to ensure unique file paths
  const uniqueFiles = new Set<string>();

  // Process each match pattern
  for (const pattern of matchPatterns) {
    const matchedFiles = await globby(pattern, {
      absolute: true,
      dot: true,
      unique: true,
      ignore: allIgnorePatterns,
      cwd: lookupCwd,
    });

    // Add matched files to the set
    matchedFiles.forEach((file) => uniqueFiles.add(file));
  }

  return Array.from(uniqueFiles);
};
