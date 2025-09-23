# @hyperse/hps

HPS is a blazing fast frontend build tool based on Rspack that powers the next generation of web applications.

[![Build](https://img.shields.io/github/actions/workflow/status/hyperse-io/hps/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-square&labelColor=000000)](https://github.com/hyperse-io/hps/actions?query=workflow%3ACI)
[![Version](https://img.shields.io/npm/v/%40hyperse%2Fhps?branch=main&label=version&logo=npm&style=flat-square&labelColor=000000)](https://www.npmjs.com/package/@hyperse/hps)
[![Top Language](https://img.shields.io/github/languages/top/hyperse-io/hps?style=flat-square&labelColor=000&color=blue)](https://github.com/hyperse-io/hps/search?l=typescript)
[![License](https://img.shields.io/badge/license-GPLv3-brightgreen.svg)](https://github.com/hyperse-io/hps/blob/main/LICENSE)

## ✨ Features

- ⚡ Blazing‑fast dev server powered by Rspack with instant HMR
- 🛠️ Zero‑config defaults with sensible conventions; override when you need
- 🔌 Extensible plugin system for CLI and build/runtime capabilities
- 📘 First‑class TypeScript, JSX/React, CSS Modules, and assets
- 🚀 Production builds with code‑splitting, tree‑shaking, and minification
- 🎛️ Built‑in PostCSS pipeline via Rspack plugin integration
- 🧪 Mock server and API proxy for local development
- ✅ Type checking service for fast feedback during development and CI
- ♻️ Incremental compilation and persistent caching for large projects
- 🧭 Monorepo‑friendly setup with clear package boundaries

## 📖 Documentation

Please see [HPS Documentation](https://hyperse-io.github.io/hps/)

## 🚀 Core Package

- **@hyperse/hps** - Core library providing basic functionality and CLI APIs

## 🧩 Plugin Ecosystem

HPS provides a rich plugin ecosystem for common CLI functionality:

- **@hyperse/hps-plugin-info** - Display environment, dependency, and CLI information
- **@hyperse/hps-plugin-serve** - Start a fast Rspack‑powered development server with HMR
- **@hyperse/hps-plugin-build** - Create optimized production builds
- **@hyperse/hps-plugin-mock** - Spin up a local mock server for API development
- **@hyperse/hps-plugin-deploy** - Deploy artifacts to your target environment
- **@hyperse/hps-plugin-update** - Check for and apply CLI/plugin updates
- **@hyperse/hps-plugin-load-config** - Load and merge project configuration
- **@hyperse/hps-plugin-pack** - Package and bundle outputs for distribution

## License

This project is licensed under the [MIT LICENSE](./LICENSE).
