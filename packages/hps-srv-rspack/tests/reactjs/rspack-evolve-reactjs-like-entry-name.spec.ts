import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import type { DeepPartial } from '@hyperse/config-loader';
import { mergeOptions } from '@hyperse/hps-srv-common';
import { type HpsEvolveOptions } from '../../src/index.js';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';
import { startTestBuild } from '../test-utils.js';
import { hpsEvolveConfig } from './hps-evolve.config.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');

describe('evolve-reactjs-like-entry-name.spec', () => {
  const doBuild = async (
    modulePattern: string[],
    buildEntries: DeepPartial<EvolveEntryMap>,
    evolveOptions: DeepPartial<HpsEvolveOptions> = {}
  ) => {
    return await startTestBuild(
      projectCwd,
      modulePattern,
      mergeOptions(hpsEvolveConfig, {
        ...evolveOptions,
        entryMap: buildEntries,
      })
    );
  };

  it('The correct generate dynamic webpack chunk file name', async () => {
    await doBuild(
      ['finance/connect-body/body', 'finance/connect-body/body-audit'],
      {
        'finance/connect-body/body': {
          entry: ['./src/body/index.tsx'],
        },
        'finance/connect-body/body-audit': {
          entry: ['./src/body-audit/index.tsx'],
        },
      }
    );

    const bodyHtmlStr = readFileSync(
      join(
        projectCwd,
        `public/hps/evolve/finance/connect-body/body/index.html`
      ),
      'utf-8'
    );
    expect(
      bodyHtmlStr.includes('hps/evolve/finance/connect-body/body/bundle')
    ).toBeTruthy();
    expect(
      bodyHtmlStr.includes('hps/evolve/finance/connect-body/body-audit/bundle')
    ).toBe(false);

    const bodyAuditHtmlStr = readFileSync(
      join(
        projectCwd,
        `public/hps/evolve/finance/connect-body/body-audit/index.html`
      ),
      'utf-8'
    );
    expect(
      bodyAuditHtmlStr.includes(
        'hps/evolve/finance/connect-body/body-audit/bundle'
      )
    ).toBeTruthy();
    expect(
      bodyAuditHtmlStr.includes('hps/evolve/finance/connect-body/body/bundle')
    ).toBe(false);
  });
});
