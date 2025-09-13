import logUpdate from 'log-update';
import { parentPort } from 'worker_threads';
import { chalk } from '@hyperse/hps-srv-common';
import { buildProgressSpinnerFrames } from '../../../constants.js';
import { formatSpinnerText } from './format-spinner-text.js';

export type ProgressWorkerMessage = {
  status: 'start' | 'end';
  data: {
    groupName: string;
    entryKeys: string[];
  };
};

let startIndex = 0;

class ProgressWorker {
  private intervalId: NodeJS.Timeout | null;

  constructor() {
    this.intervalId = null;
  }

  start(groupName: string, entryKeys: string[]) {
    if (this.intervalId) {
      return;
    }
    this.intervalId = setInterval(() => {
      startIndex = ++startIndex % buildProgressSpinnerFrames.length;
      const startFrame = buildProgressSpinnerFrames[startIndex];
      const groupNameTmp = `Group ${chalk(['magenta'])(groupName)} compiling...`;
      logUpdate(
        `${chalk(['cyan'])(startFrame)} ${groupNameTmp} \n${formatSpinnerText(entryKeys)}`
      );
    }, 100);
  }

  end(groupName: string, entryKeys: string[]) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    const groupNameTmp = `Group ${chalk(['magenta'])(groupName)} ${chalk(['green'])('done')}`;
    logUpdate(
      `${chalk(['green'])('✔')} ${groupNameTmp} \n${formatSpinnerText(entryKeys, '✔', 'green')}`
    );
    logUpdate.done();
  }
}

const progressWorker = new ProgressWorker();

parentPort?.on('message', ({ status, data }: ProgressWorkerMessage) => {
  const { groupName, entryKeys } = data;
  if (status === 'start') {
    progressWorker.start(groupName, entryKeys);
  } else if (status === 'end') {
    progressWorker.end(groupName, entryKeys);
  }
});
