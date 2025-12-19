import { fetcher } from '@/common';

type NpmPackageResponse = {
  'dist-tags': {
    latest: string;
    next: string;
  };
};

export const fetchReleaseVersion = async (): Promise<string> => {
  const response = await fetcher.get<NpmPackageResponse>(
    'https://registry.npmjs.org/@hyperse/hps',
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600',
      },
    }
  );
  const version = response['dist-tags'].latest;
  return version ? `v${version}` : 'latest';
};
