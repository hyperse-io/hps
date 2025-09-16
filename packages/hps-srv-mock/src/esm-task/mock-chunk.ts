import { createHash } from 'node:crypto';
import { arrayChunk } from '@hyperse/hps-srv-common';

const cachedMockMap = new Map<string, string[]>();
const fileDict = new Map<string, string>();

function cacheChunkFiles(mockFiles: string[], size: number) {
  if (!mockFiles.length) {
    return;
  }
  // Create chunk map only at first time.
  const mockFileChunks = arrayChunk(mockFiles, size);
  for (const oneChunk of mockFileChunks) {
    const chunkId = md5(oneChunk);
    for (const mockFile of oneChunk) {
      fileDict.set(mockFile, chunkId);
    }
    cachedMockMap.set(chunkId, oneChunk);
  }
}

/**
 * Returns an MD5 hash for the given `content`.
 */
function md5(files: string[]) {
  const fileStr = files.sort((a, b) => a.length - b.length).join(';');
  return createHash('md5').update(fileStr).digest('hex');
}

/**
 * Try to find the `watcher` server for specificed mock file
 * @param mockDefFile
 * @returns If found return `watcher` id
 */
const getChunkIdByDefFile = (mockDefFile: string): string | undefined => {
  return fileDict.get(mockDefFile);
};

/**
 * Split all mock files into multi chunk with a `size`
 * @param mockFiles
 * @param size
 */
const spanMockFilesToChunks = (
  mockFiles: string[],
  size = 30,
  refresh = false
): Map<string, string[]> => {
  if (refresh) {
    fileDict.clear();
    cachedMockMap.clear();
  }
  const unChunkedFiles: string[] = [];

  // Has existed mock file queue here.
  if (cachedMockMap.size === 0) {
    // Create chunk map only at first time.
    cacheChunkFiles(mockFiles, size);
  } else {
    for (const mockFile of mockFiles) {
      if (!fileDict.get(mockFile)) {
        unChunkedFiles.push(mockFile);
      }
    }
    cacheChunkFiles(unChunkedFiles, size);
  }

  return cachedMockMap;
};

/**
 * Allow us remove mock chunk group
 * @param chunkId
 */
const removeMockChunkById = (chunkId: string) => {
  cachedMockMap.delete(chunkId);
};

/**
 * Provider utils to help handle mock entry files chunk.
 */
export const mockChunks = {
  removeMockChunkById,
  spanMockFilesToChunks,
  getChunkIdByDefFile,
};
