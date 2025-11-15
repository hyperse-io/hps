import type { MetaRecord } from 'nextra';

const meta: MetaRecord = {
  index: {
    type: 'page',
    display: 'hidden',
  },
  guide: {
    type: 'page',
    title: 'Guide',
  },
  config: {
    type: 'page',
    title: 'Config',
  },
  plugins: {
    type: 'page',
    title: 'Plugins',
  },
  resources: {
    type: 'menu',
    title: 'Resources',
    items: {
      about: {
        title: 'About',
        href: '/resources/about',
      },
      releases: {
        title: 'Releases',
        href: '/resources/releases',
      },
      blog: {
        title: 'Blog',
        href: '/resources/blog',
      },
    },
  },
  version: {
    type: 'menu',
    title: 'v1.0.0',
    items: {
      changelog: {
        title: 'Changelog',
        href: 'https://github.com/hyperse-io/hps/blob/main/packages/hps/CHANGELOG.md',
      },
      contributing: {
        title: 'Contributing',
        href: 'https://github.com/hyperse-io/hps/blob/main/CONTRIBUTING.md',
      },
    },
  },
};

export default meta;
