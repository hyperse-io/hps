import type { TransformOptions } from '@babel/core';

type EvolvePresetPresets = {
  /**
   * List of plugins to load and use
   *
   * Default: `[]`
   */
  plugins?: TransformOptions['plugins'];
  /**
   * List of presets (a set of plugins) to load and use
   *
   * Default: `[]`
   */
  presets?: TransformOptions['presets'];
};

export const reactBabelPreset = (
  mode: 'development' | 'production'
): EvolvePresetPresets => {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          // https://babeljs.io/docs/babel-preset-env#loose
          // Set the corejs version we are using to avoid warnings in console
          corejs: 3,
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: 'entry',
          // Set the corejs version we are using to avoid warnings in console
          exclude: [
            // Exclude transforms that make all code slower
            'transform-typeof-symbol',
            // Exclude transforms use `FastAsync`
            'transform-regenerator',
            // Exclude transforms use `FastAsync`
            'transform-async-to-generator',
          ],
          targets: {
            browsers: ['ie >= 11', 'safari > 10'],
          },
        },
      ],
      [
        '@babel/preset-typescript',
        {
          isTSX: false,
          allExtensions: false,
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
          development: mode === 'development',
        },
      ],
    ],
    plugins: [],
  };
};
