/**
 * @fileoverview Utility functions for the HPS Deploy Plugin
 *
 * This module provides utility functions for file operations, path handling,
 * and remote file checking used throughout the deployment process.
 */

// Path utilities
export { ensureSlash } from './ensureSlash.js';

// File utilities
export type { PrepareUploadFilesOptions } from './prepareUploadFiles.js';
export { prepareUploadFiles } from './prepareUploadFiles.js';

// Network utilities
export type { RemoteFileCheckOptions } from './isRemoteFileExist.js';
export { isRemoteFileExist } from './isRemoteFileExist.js';
