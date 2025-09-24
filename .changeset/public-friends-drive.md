---
"@hyperse/hps-srv-rspack-plugin-postcss": patch
"@hyperse/hps-plugin-load-config": patch
"@hyperse/hps-srv-ts-checker": patch
"@hyperse/hps-plugin-deploy": patch
"@hyperse/hps-plugin-update": patch
"@hyperse/hps-plugin-build": patch
"@hyperse/hps-plugin-serve": patch
"@hyperse/hps-srv-rolldown": patch
"@hyperse/hps-plugin-info": patch
"@hyperse/hps-plugin-mock": patch
"@hyperse/hps-plugin-pack": patch
"@hyperse/hps-srv-common": patch
"@hyperse/hps-srv-rspack": patch
"@hyperse/hps-srv-mock": patch
"@hyperse/hps": patch
---

## 🚀 New Features

- **Rspack Plugin Configuration Refactor**: Unify htmlPlugin settings and enhance output options for better build optimization
- **Enhanced MultiHtmlPlugin Integration**: Streamlined rspack configuration with improved loader and plugin options
- **TypeScript Checker Integration**: Add hps-srv-ts-checker package with integrated TypeScript checker functionality
- **Dynamic UI Enhancements**: Enhanced main module layout and styling with improved header, list items, and dynamic datetime display

## 🔧 Performance Improvements

- **Improved Chunk File Handling**: Better build optimization and chunk management
- **Enhanced Circular Dependency Detection**: Improved regex patterns in cutBefore function for better performance
- **Streamlined Configuration Merging**: Optimized inspector evolve config processing

## 🐞 Bug Fixes

- **Environment Variable Handling**: Update public environment variable keys to include process.env prefix
- **Browser Opening Functionality**: Replace 'open' with 'better-opn' for improved tab handling
- **Library Output Handling**: Skip entries with defined output library in mergeInspectorEvolveConfig

## 📖 Documentation Updates

- **Enhanced README Files**: Update HPS and plugin documentation with enhanced features, installation instructions, and usage examples
- **Improved Developer Experience**: Better documentation across the ecosystem

## 🔨 Refactoring

- **Configuration Handling**: Update dependencies and refactor configuration handling in hps package
- **Code Organization**: Improved import management and code structure across packages
