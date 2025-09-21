import type { Issue } from '../types/type-issue.js';
import { createCodeFrameFormatter } from './helper-create-code-frame-formatter.js';

export function errorFormatter(issues: Issue[]): string {
  const errorsNumber = issues.filter(
    (issue) => issue.severity === 'error'
  ).length;
  const warningsNumber = issues.filter(
    (issue) => issue.severity === 'warning'
  ).length;

  return [
    'TS_CHECKER_ERROR: ',
    'Found ',
    errorsNumber,
    ' errors ',
    errorsNumber > 0 && warningsNumber > 0 ? ' and ' : '',
    warningsNumber,
    ' warnings ',
    '.',
  ].join('');
}

export class IssueError extends Error {
  constructor(issues: Issue[]) {
    super(errorFormatter(issues));
    this.formatIssues(issues);
  }

  private formatIssues(issues: Issue[]) {
    const formatter = createCodeFrameFormatter();

    for (const issue of issues) {
      console.log(formatter(issue));
    }
  }
}
