import type { MetaRecord } from 'nextra';

const mate: MetaRecord = {
  introduction: {
    title: 'Introduction',
  },
  'getting-started': {
    title: 'Getting Started',
  },
  'why-hps': {
    title: 'Why Hps',
  },
  '#': {
    type: 'separator',
  },
  guide: {
    title: 'Guide',
    theme: {
      copyPage: true,
      collapsed: false,
    },
  },
  api: {
    title: 'API',
    theme: {
      copyPage: true,
      collapsed: false,
    },
  },
};

export default mate;
