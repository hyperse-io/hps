import { heroui } from '@heroui/react';

// hero.ts
const hero = heroui({
  prefix: 'hyperse', // prefix for themes variables
  addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
  defaultTheme: 'light', // default theme from the themes object
  defaultExtendTheme: 'light', // default theme to extend on custom themes
  layout: {}, // common layout tokens (applied to all themes)
});

export default hero as ReturnType<typeof heroui>['config'];
