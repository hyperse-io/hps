import { posix } from 'node:path';
import { urlJoin } from '@hyperse/hps-srv-common';

export const getBundleAsset = (
  devServerHostUri: string,
  normalizedCurrEntry: string,
  extension: '.css' | '.js'
) => {
  return urlJoin(devServerHostUri, [
    posix.join('public', normalizedCurrEntry, `bundle${extension}`),
  ]);
};
