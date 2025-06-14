import minimist from 'minimist';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Get files
 * @param {string} dirPath
 * @param {string[]} arrayOfFiles
 * @returns
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    if (statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(join(process.cwd(), dirPath, '/', file));
    }
  });
  return arrayOfFiles.filter((path) => /\.(js|mjs)$/.exec(path));
}

/**
 * Minify files
 * @param {string[]} filePaths
 */
async function minifyFiles(filePaths) {
  for (const filePath of filePaths) {
    const { minify } = await import('terser');
    const result = await minify(readFileSync(filePath, 'utf8'), {
      keep_fnames: true,
      keep_classnames: true,
      mangle: {
        keep_fnames: true,
        keep_classnames: true,
      },
    });
    writeFileSync(filePath, result.code || '');
  }
}

(function program() {
  const parsed = minimist(process.argv.slice(2));
  const files = getAllFiles(`./${parsed.dest}`);
  minifyFiles(files).catch((err) => {
    console.log(`Minify failed!`, err);
  });
})();
