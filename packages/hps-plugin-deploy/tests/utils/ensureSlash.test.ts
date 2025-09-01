import { describe, expect, it } from 'vitest';
import { ensureSlash } from '../../src/utils/ensureSlash.js';

describe('ensureSlash', () => {
  describe('basic functionality', () => {
    it('should return the same string when no trailing slash and slashEndfix is false', () => {
      expect(ensureSlash('/path/to/dir')).toBe('/path/to/dir');
      expect(ensureSlash('path/to/dir')).toBe('path/to/dir');
    });

    it('should add trailing slash when slashEndfix is true', () => {
      expect(ensureSlash('/path/to/dir', true)).toBe('/path/to/dir/');
      expect(ensureSlash('path/to/dir', true)).toBe('path/to/dir/');
    });

    it('should remove existing trailing slash when slashEndfix is false', () => {
      expect(ensureSlash('/path/to/dir/', false)).toBe('/path/to/dir');
      expect(ensureSlash('path/to/dir/', false)).toBe('path/to/dir');
    });

    it('should keep existing trailing slash when slashEndfix is true', () => {
      expect(ensureSlash('/path/to/dir/', true)).toBe('/path/to/dir/');
      expect(ensureSlash('path/to/dir/', true)).toBe('path/to/dir/');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(ensureSlash('')).toBe('');
      expect(ensureSlash('', true)).toBe('/');
    });

    it('should handle single slash', () => {
      expect(ensureSlash('/')).toBe('');
      expect(ensureSlash('/', true)).toBe('/');
    });

    it('should handle multiple trailing slashes', () => {
      expect(ensureSlash('/path/to/dir///')).toBe('/path/to/dir');
      expect(ensureSlash('/path/to/dir///', true)).toBe('/path/to/dir/');
    });

    it('should handle paths with only slashes', () => {
      expect(ensureSlash('///')).toBe('');
      expect(ensureSlash('///', true)).toBe('/');
    });
  });

  describe('automatic platform detection', () => {
    it('should use forward slashes for Unix-style paths', () => {
      expect(ensureSlash('/path/to/dir', true)).toBe('/path/to/dir/');
      expect(ensureSlash('./src/components', true)).toBe('./src/components/');
    });

    it('should use backslashes for Windows-style paths', () => {
      expect(ensureSlash('C:\\path\\to\\dir', true)).toBe(
        'C:\\path\\to\\dir\\'
      );
      expect(ensureSlash('D:\\Program Files\\App', true)).toBe(
        'D:\\Program Files\\App\\'
      );
    });

    it('should detect Windows paths by presence of backslashes', () => {
      expect(ensureSlash('C:\\path\\to\\dir\\', true)).toBe(
        'C:\\path\\to\\dir\\'
      );
      expect(ensureSlash('\\path\\to\\dir', true)).toBe('\\path\\to\\dir\\');
    });

    it('should default to forward slashes when no backslashes detected', () => {
      expect(ensureSlash('/path/to/dir', true)).toBe('/path/to/dir/');
      expect(ensureSlash('path/to/dir', true)).toBe('path/to/dir/');
    });
  });

  describe('error handling', () => {
    it('should throw TypeError for non-string inputs', () => {
      expect(() => ensureSlash(null as any)).toThrow(TypeError);
      expect(() => ensureSlash(undefined as any)).toThrow(TypeError);
      expect(() => ensureSlash(123 as any)).toThrow(TypeError);
      expect(() => ensureSlash({} as any)).toThrow(TypeError);
      expect(() => ensureSlash([] as any)).toThrow(TypeError);
    });

    it('should throw error with correct message', () => {
      expect(() => ensureSlash(null as any)).toThrow('Path must be a string');
    });
  });

  describe('mixed slash types', () => {
    it('should detect Windows-style when backslashes are present', () => {
      expect(ensureSlash('/path\\to/dir\\', true)).toBe('/path\\to/dir\\');
      expect(ensureSlash('C:\\path/to\\dir', true)).toBe('C:\\path/to\\dir\\');
    });

    it('should handle mixed slashes and use backslash as trailing when Windows-style detected', () => {
      expect(ensureSlash('/path\\to/dir\\')).toBe('/path\\to/dir');
      expect(ensureSlash('/path\\to/dir\\', true)).toBe('/path\\to/dir\\');
    });
  });

  describe('real-world examples', () => {
    it('should handle typical Unix paths', () => {
      expect(ensureSlash('/usr/local/bin')).toBe('/usr/local/bin');
      expect(ensureSlash('/usr/local/bin/', true)).toBe('/usr/local/bin/');
    });

    it('should handle typical Windows paths', () => {
      expect(ensureSlash('C:\\Program Files\\App')).toBe(
        'C:\\Program Files\\App'
      );
      expect(ensureSlash('C:\\Program Files\\App\\', true)).toBe(
        'C:\\Program Files\\App\\'
      );
    });

    it('should handle relative paths', () => {
      expect(ensureSlash('./src/components')).toBe('./src/components');
      expect(ensureSlash('./src/components/', true)).toBe('./src/components/');
    });

    it('should handle network paths', () => {
      expect(ensureSlash('\\\\server\\share\\folder')).toBe(
        '\\\\server\\share\\folder'
      );
      expect(ensureSlash('\\\\server\\share\\folder\\', true)).toBe(
        '\\\\server\\share\\folder\\'
      );
    });
  });
});
