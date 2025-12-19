import { useMemo } from 'react';
import type { MetaRecord } from 'nextra';
import { fetchReleaseVersion } from '@/services';

const VersionComponent = async () => {
  const version = await fetchReleaseVersion();
  return <div>{version}</div>;
};

const meta: MetaRecord = {
  index: {
    type: 'page',
    display: 'hidden',
  },
  guide: {
    type: 'page',
    title: 'Guide',
  },
  configuration: {
    type: 'page',
    title: 'Configuration',
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
        title: 'About Hyperse',
        href: '/resources/about',
      },
      blog: {
        title: 'Hyperse Blog',
        href: 'https://www.hyperse.net/blog',
      },
    },
  },
  version: {
    type: 'menu',
    title: <VersionComponent />,
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
