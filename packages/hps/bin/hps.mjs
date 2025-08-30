#!/usr/bin/env node
import { cli } from '../index.js';

cli.parse(process.argv.slice(2)).catch((err) => {
  console.log(`boostrap hps cli error:`, err);
});
