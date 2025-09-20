# the demo using reactjs

## install node_modules locally

## Note: If we want to import `.svg` file like below

```tsx
import info from './svg-icons/info.svg';
```

We must follow the naming convention the svg folder `svg-icons` is required.

- svg-icons
  - info.svg
  - loading.svg

## About NodeNext & type:module

1. declare `type:module` in package.json
2. update tsconfig.json make sure ` "moduleResolution": "node"`, for now do not support `nodenext`
3. keep in eye `nodenext`
4. tsconfig.json `path` don't suffix `.js`
