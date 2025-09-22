import { existsSync, readFileSync } from 'node:fs';
import os from 'node:os';
import { codeFrameColumns } from '@babel/code-frame';
import { chalk } from '@hyperse/hps-srv-common';
import type { Issue } from '../types/type-issue.js';

type Formatter = (issue: Issue) => string;

function createBasicFormatter(): Formatter {
  return function basicFormatter(issue) {
    return chalk(['gray'])(issue.code + ': ') + issue.message;
  };
}

/**
 * Creates a formatter that displays code frames for issues.
 *
 * This formatter enhances the basic formatter by adding a code frame
 * that highlights the relevant code section where the issue occurs.
 * It reads the source file, generates a formatted code frame using
 * the issue's location information, and combines it with the basic
 * issue message.
 *
 * @returns A formatter function that takes an issue and returns a formatted string
 *          with code frame highlighting if the source file exists and location is provided.
 */
export const createCodeFrameFormatter = (): Formatter => {
  const basicFormatter = createBasicFormatter();

  return function codeFrameFormatter(issue) {
    const source =
      issue.file && existsSync(issue.file) && readFileSync(issue.file, 'utf-8');

    let frame = '';
    if (source && issue.location) {
      frame = codeFrameColumns(source, issue.location, {
        highlightCode: true,
      })
        .split('\n')
        .map((line) => '  ' + line)
        .join(os.EOL);
    }

    const lines = [basicFormatter(issue)];
    if (frame) {
      lines.push(frame);
    }

    return lines.join(os.EOL);
  };
};
