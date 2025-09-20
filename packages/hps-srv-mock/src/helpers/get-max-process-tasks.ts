import { cpus } from 'node:os';

export const getMaxProcessTasks = (
  totalTasks: number,
  maxProcesses: string | number = '80%'
) => {
  const maxCpu = Math.max(
    1,
    typeof maxProcesses === 'string' && maxProcesses.endsWith('%')
      ? Math.round((cpus().length * Number(maxProcesses.slice(0, -1))) / 100)
      : Number(maxProcesses)
  );
  return totalTasks > maxCpu ? maxCpu : Math.max(1, totalTasks);
};
