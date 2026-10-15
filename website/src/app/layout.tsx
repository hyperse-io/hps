import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { basePath } from '@/lib/base-path';
import '@/app/globals.css';

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

const RootLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href={`${basePath}/favicon.ico`}
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        {/*
          Fumadocs' static search client builds its URL as
          `join(BASE_PATH, api)`, and `BASE_PATH` comes from Vite's
          `import.meta.env.BASE_URL` — which does not exist in Next.js, so it is
          always `'/'`. Next.js' `basePath` is therefore NOT applied
          automatically, and omitting it makes the client request
          `/api/search` (404) instead of `${basePath}/api/search`.
        */}
        <RootProvider
          search={{
            options: { type: 'static', api: `${basePath}/api/search` },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
