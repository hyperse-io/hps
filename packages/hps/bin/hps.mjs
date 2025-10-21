#!/usr/bin/env node
import { enableCompileCache } from 'module';
enableCompileCache?.();

const { cli } = await import('../index.js');

cli.parse(process.argv.slice(2)).catch((err) => {
  console.log(`boostrap hps cli error:`, err);
});
