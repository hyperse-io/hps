import type { Worker } from 'node:worker_threads';
import type { EntryMapItem } from '../../../types/types-entry-map.js';
import type { ProgressWorkerMessage } from './progress-worker.js';

export const progressHandler = (
  worker: Worker,
  entryMapItemList: EntryMapItem[]
) => {
  const firstEntryMapItem = entryMapItemList[0];
  const [_, entryItemOption] = firstEntryMapItem;

  const groupName = entryItemOption?.groupName || '';
  const entryKeys = entryMapItemList.map(([entryName]) => entryName);

  return (percentage: number, _: string) => {
    const status = percentage > 0 && percentage < 1 ? 'start' : 'end';
    const messageData: ProgressWorkerMessage = {
      status,
      data: {
        groupName,
        entryKeys,
      },
    };
    worker.postMessage(messageData);
  };
};
