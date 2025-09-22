/**
 * A better opn. Reuse the same tab on Chrome for
 * @example
 * `http://xxx.domain.com:3001/pages`
 * @param openUrl the page url try to open.
 */
export const openPage = async (openUrl: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const opn = await import('better-opn');
    opn.default(openUrl);
  } catch {
    console.warn(
      `Unable to open browser. If you are running in a headless environment\n`
    );
  }
};
