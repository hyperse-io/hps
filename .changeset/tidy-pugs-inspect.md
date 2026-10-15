---
'@hyperse/hps-srv-rspack': patch
---

Upgrade `@hyperse/inspector-swc-plugin` to `^2.0.4` so the inspector SWC Wasm
plugin matches the `swc_core` version shipped by Rspack 2.2.x.

Rspack 2.2.x embeds `swc_core` 82.0.0 (plugin runner ABI 34.0.0). The previous
plugin build was compiled against `swc_core` 64, which made `builtin:swc-loader`
fail in development with:

```
failed to run Wasm plugin transform. Please ensure the version of `swc_core`
used by the plugin is compatible with the host runtime.
  swc_plugin_runner: 34.0.0
  : Failed to deserialize program received from host
```

The rebuilt plugin targets `swc_core` 82.1.1, which is also the ABI used by
Next.js 16.4.x (Turbopack), so a single Wasm build now works for both Rspack and
Next.js inspector integrations.
