# @hyperse/hps-srv-rspack-plugin-import

A SWC plugin for dynamic imports, enabling on-demand file imports. Written in Rust for better performance.

## Installation

```bash
yarn add @hyperse/hps-srv-rspack-plugin-import
```

## Usage

Add the `@hyperse/hps-srv-rspack-plugin-import` plugin to your rspack configuration

```ts
export default {
  module: {
    rules: [
      {
        test: /\.(jsx|tsx|ts|js|mjs|cjs|mts|cts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              experimental: {
                keepImportAttributes: true,
                plugins: [
                  [
                    requireResolve(
                      import.meta.url,
                      '@hyperse/hps-srv-rspack-plugin-import'
                    ),
                    {
                      modularImports: [
                        {
                          libraryName: '@dimjs/utils',
                          libraryDirectory: 'dist',
                          transformToDefaultImport: true,
                          customName:
                            '@dimjs/utils/dist/{{ kebabCase member }}/index.js',
                        },
                        {
                          libraryName: '@ant-design/icons',
                          libraryDirectory: 'es/icons',
                          transformToDefaultImport: true,
                          camel2DashComponentName: false,
                          customName:
                            '@ant-design/icons/es/icons/{{ member }}.js',
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          },
        },
      },
    ],
  },
};
```

## Development & Testing

- Please use the official installation method. The version installed via homebrew will lack the rustup toolchain and requires manual installation and configuration. [rustup](https://rustup.rs/)

1. Install Rust environment

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Install the toolchain for compiling WebAssembly version. For more information about rustup toolchains, please refer to [rustup](https://doc.rust-lang.org/rustc)

```bash
rustup target add wasm32-wasip1
```

3. View installed toolchains

```bash
rustup target list
```

4. Testing

- For Rust WASM testing, you can use cargo-related packages for testing.
- Since swc-plugin-import will be loaded into swc for execution, you can also use testing frameworks like vitest for testing.

5. Build and Publish

```bash
cargo build --release -p swc_plugin_import --target wasm32-wasip1
```

swc_plugin_import now supports monorepo management, so you can directly use the `yarn build` command for building.

## Notes

1. SWC strongly depends on the version of `@swc/core`. Development needs to be done according to the corresponding swc version. The current project's dependency version information can be found in [cargo.toml](../../cargo.toml).
2. If the plugin is used in rspack, you need to use `builtin:swc-loader` for loading.
3. Due to performance considerations when calling JS from Rust, the customName implementation in the plugin uses the [Handlebars](https://handlebarsjs.com/) template engine and does not support configuring functions.

## References

1. [Handlebars](https://handlebarsjs.com/)
2. [rspack](https://rspack.dev/zh/guide/features/builtin-swc-loader#jscexperimentalplugins)
3. [swc](https://swc.rs/)
4. [swc plugin version](https://plugins.swc.rs/)
5. [rspack faq](https://rspack.dev/zh/errors/swc-plugin-version)
