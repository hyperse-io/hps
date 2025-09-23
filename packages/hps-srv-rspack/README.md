# @hyperse/hps-srv-rspack

Rspack-based build and dev-serve toolkit for modern web apps. It wraps common build features (HTML generation, CSS/LESS, PostCSS, assets, SVG icons, image optimization), integrates TypeScript checking, React Fast Refresh, multi-page support, Module Federation, and a rich dev server with helpful middlewares and diagnostics.

- **Dev server & build orchestration**: Start serve/build with sensible defaults and clear logs.
- **HTML pipeline**: Multi-HTML support, HTML script/style injection, runtime manifest and CDN base handling.
- **TypeScript checking**: Integrated with `@hyperse/hps-srv-ts-checker` for fast and friendly type diagnostics.
- **CSS/LESS & PostCSS**: First-class rules for CSS/LESS, PostCSS via `@hyperse/hps-srv-rspack-plugin-postcss`.
- **Assets & SVG icons**: Assets handling and dedicated SVG icon rule/loader.
- **React Fast Refresh**: Automatic enablement in serve mode when applicable.
- **Image optimization**: Optional integration with imagemin plugins for gifs/jpeg/png/svg.
- **Module Federation**: Helpers for configuring federation setup.
- **Progress & diagnostics**: Build progress, circular dependency checks, improved error evolution and reporting.

## Installation

Requires Node.js >= 20.

```bash
# yarn
yarn add -D @hyperse/hps-srv-rspack
# npm
npm i -D @hyperse/hps-srv-rspack
# pnpm
pnpm add -D @hyperse/hps-srv-rspack
```
