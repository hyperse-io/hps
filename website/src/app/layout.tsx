import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Banner, Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
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

const banner = (
  <Banner dismissible={false}>🎉🎉🎉Hyperse Hps 0.1.2 is released.</Banner>
);
const navbar = (
  <Navbar
    logo={
      <div className="flex items-center gap-2">
        <Image src="/hps/logo.svg" alt="HPS" width={48} height={48} />
        <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-xl font-bold text-transparent">
          HPS
        </span>
      </div>
    }
    projectLink="https://github.com/hyperse-io/hps"
  />
);
const footer = (
  <Footer className="bg-[rgba(255, 255, 255, 0.05)] flex-col items-center md:items-start">
    <a
      className="x:focus-visible:nextra-focus flex items-center gap-1"
      target="_blank"
      rel="noreferrer"
      title="Hyperse on GitHub"
      href="https://github.com/hyperse-io"
    >
      Powered by Hyperse
    </a>
    <p className="mt-6 text-xs">
      {`© ${new Date().getFullYear()}`} Hyperse Inc. All rights reserved.
    </p>
  </Footer>
);

const RootLayout: FC<{
  children: ReactNode;
}> = async ({ children }) => {
  const pageMap = await getPageMap();

  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/hyperse-io/hps/tree/main/website"
          editLink="Edit this page on GitHub"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          nextThemes={{
            forcedTheme: 'dark',
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
