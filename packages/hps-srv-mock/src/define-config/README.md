## Note

We must be individual export `define-config` and keep it clean. cause of for `@hyperse/config-loader`
will bundle all `hps-mock.config.ts` into `.mjs` file and `import` it, so we must be keep `define-config` clean enough

```ts
import { defineConfig } from '@hyperse/hps-srv-mock';

export default defineConfig({
  //....
});
```
