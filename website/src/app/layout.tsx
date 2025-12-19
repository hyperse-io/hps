import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Banner, Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { Provider } from '@/components/Provider';
import { fetchReleaseVersion } from '@/services';
import './globals.css';

export const metadata: Metadata = {
  description:
    'HPS is a blazing fast frontend build tool based on Rspack that powers the next generation of web applications.',
  metadataBase: new URL('https://www.hyperse.net/'),
  keywords: [
    'Hyperse',
    'Wizard',
    'Hps',
    'Rspack',
    'Cli',
    'Devtools',
    'Framework',
    'TypeScript',
    'JavaScript',
  ],
  generator: 'Hyperse',
  applicationName: 'Hyperse Hps',
  appleWebApp: {
    title: 'Hyperse Hps',
  },
  title: {
    default: 'Hyperse Hps – Hyperse Hps',
    template: '%s | Hyperse Hps',
  },
  openGraph: {
    // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
    url: './',
    siteName: 'Hyperse Hps',
    locale: 'en_US',
    type: 'website',
  },
  other: {
    'msapplication-TileColor': '#fff',
  },
  twitter: {
    site: 'https://www.hyperse.net/',
  },
  alternates: {
    // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
    canonical: './',
  },
};

const BannerComponent = ({ version }: { version: string }) =>
  version ? (
    <Banner dismissible={false}>
      🎉🎉🎉Hyperse Hps {version} is released.
    </Banner>
  ) : null;

const NavbarComponent = () => (
  <Navbar
    logo={
      <div className="flex items-center gap-2">
        <Image src="/hps/logo.svg" alt="HPS" width={24} height={24} />
        <span className="text-xl font-bold text-white">HPS</span>
      </div>
    }
    projectLink="https://github.com/hyperse-io/hps"
  />
);

const RootLayout: FC<{
  children: ReactNode;
}> = async ({ children }) => {
  const pageMap = await getPageMap();
  const releaseVersion = await fetchReleaseVersion();

  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          banner={<BannerComponent version={releaseVersion} />}
          navbar={<NavbarComponent />}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/hyperse-io/hps/tree/main/website"
          editLink="Edit this page on GitHub"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          nextThemes={{
            forcedTheme: 'dark',
          }}
        >
          <Provider version={releaseVersion}>{children}</Provider>
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
