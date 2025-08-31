/**
 * Check if file existed on Remote server
 * @param httpFilePath
 * @returns
 */
export const isRemoteFileExist = async (
  httpFilePath: string
): Promise<boolean> => {
  return fetch(httpFilePath, {
    method: 'GET',
  })
    .then((res) => {
      return !!(res.status === 200 || res.status === 304);
    })
    .catch(() => {
      return false;
    });
};
