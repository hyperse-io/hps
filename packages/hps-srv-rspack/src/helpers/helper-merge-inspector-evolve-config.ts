import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { searchPackageDir } from '@armit/package';
import { logger, mergeOptions, requireResolve } from '@hyperse/hps-srv-common';
import type { HpsEvolveOptions } from '../types/types-options.js';
import { normalizePageProxy } from './helper-normalize-page-proxy.js';

export const mergeInspectorEvolveConfig = (
  evolveOptions: HpsEvolveOptions
): HpsEvolveOptions => {
  const { inspector, devServer } = evolveOptions;
  if (!inspector) {
    return evolveOptions;
  }

  // If React and ReactDOM are external dependencies, you need to manually integrate Inspector
  const { externals: rspackExternals } = evolveOptions.rspack || {};
  if (rspackExternals) {
    let externalMap = rspackExternals;
    if (typeof rspackExternals === 'function') {
      externalMap = rspackExternals();
    }
    if (
      (externalMap as Record<string, string>)['react'] ||
      (externalMap as Record<string, string>)['react-dom']
    ) {
      logger.warn(
        'React and ReactDOM are external dependencies, you need to manually integrate Inspector'
      );
      return evolveOptions;
    }
  }

  const pageProxy = normalizePageProxy(devServer?.pageProxy || '/pages');

  const {
    keys = ['$mod', 'i'],
    customLaunchEditorEndpoint = '/__hps_inspector',
  } = inspector;

  const definePlugin = {
    'process.env.INSPECTOR_ENDPOINT': JSON.stringify(
      join(pageProxy, customLaunchEditorEndpoint)
    ),
    'process.env.INSPECTOR_KEYS': JSON.stringify(keys.join(',')),
    'process.env.INSPECTOR_HIDE_CONSOLE': JSON.stringify('FALSE'),
    'process.env.INSPECTOR_HIDE_CONTEXT': JSON.stringify('TRUE'),
    'process.env.INSPECTOR_HIDE_DOM_PATH_ATTR': JSON.stringify('TRUE'),
    'process.env.INSPECTOR_DISABLE': JSON.stringify('FALSE'),
  };

  const newEvolveOptions = mergeOptions(evolveOptions, {
    rspack: {
      plugins: {
        definePlugin: {
          variables: definePlugin,
        },
      },
    },
  });

  const inspectorPackage = requireResolve(
    import.meta.url,
    '@hyperse/inspector'
  );

  const inspectorPackageDir = searchPackageDir({
    cwd: fileURLToPath(dirname(inspectorPackage)),
  });

  if (!inspectorPackageDir) {
    logger.debug('@hyperse/inspector package not found');
    return newEvolveOptions;
  }

  const clientEntry = join(inspectorPackageDir, 'dist', 'client', 'index.js');
  const entryMap = newEvolveOptions.entryMap;

  for (const [_, entryMapItem] of Object.entries(entryMap)) {
    if (entryMapItem.options?.output?.library) {
      continue;
    }
    const entry = entryMapItem.entry;
    entry.unshift(clientEntry);
  }

  return newEvolveOptions;
};
