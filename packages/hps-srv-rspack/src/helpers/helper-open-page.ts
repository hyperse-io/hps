import open from 'open';

/**
 * A better opn. Reuse the same tab on Chrome for
 * @example
 * `http://xxx.domain.com:3001/pages`
 * @param openUrl the page url try to open.
 */
export const openPage = (openUrl: string): void => {
  try {
    open(openUrl);
  } catch {
    console.warn(
      `Unable to open browser. If you are running in a headless environment\n`
    );
  }
};
