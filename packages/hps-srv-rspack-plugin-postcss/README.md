# @hyperse/hps-srv-rspack-plugin-postcss

A PostCSS plugin to convert px/rpx to rem/rpx, used by Hyperse HPS on the Rspack server side. It can also be used as a standalone PostCSS plugin in any project.

- **Conversion**: Convert `px` or `rpx` to `rem` (or keep `rpx`)
- **Precision control**: Keep decimals with rounding consistent with tests
- **Fine-grained control**: Selector blacklist, prop white/black list, media queries, min pixel value
- **Precise ignore**: Use `ignoreIdentifier` to skip a specific value within a declaration

## Installation

```bash
# yarn
yarn add -D @hyperse/hps-srv-rspack-plugin-postcss postcss

# npm
npm i -D @hyperse/hps-srv-rspack-plugin-postcss postcss

# pnpm
pnpm add -D @hyperse/hps-srv-rspack-plugin-postcss postcss
```
