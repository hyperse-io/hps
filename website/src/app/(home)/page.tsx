import type { Metadata } from 'next';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Performance } from '@/components/Performance';
import './page.css';

export const metadata: Metadata = {
  title: 'Hyperse Hps',
  description:
    'HPS is a blazing fast frontend build tool based on Rspack that powers the next generation of web applications.',
};

function App() {
  return (
    <div className="grid-bg relative flex min-h-screen flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <main className="flex-grow">
        <Hero />
        <Performance />
        <Features />

        {/* CTA Section */}
        <section className="relative overflow-hidden py-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/10"></div>
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-6 text-4xl font-bold text-white">
              Ready to speed up your workflow?
            </h2>
            <p className="mb-10 text-xl text-gray-400">
              Join thousands of developers building the future of the web with
              HPS.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/hps/docs/guide/getting-started"
                className="cursor-pointer rounded-lg bg-white px-8 py-4 font-bold text-black transition-colors hover:bg-gray-200"
              >
                Get Started Now
              </a>
              <a
                href="https://github.com/hyperse-io/hps"
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer rounded-lg border border-white/20 bg-transparent px-8 py-4 font-bold text-white transition-colors hover:bg-white/10"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
