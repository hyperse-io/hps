'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Features } from '../../components/Features';
import { Hero } from '../../components/Hero';
import { Performance } from '../../components/Performance';
import './page.css';

function App() {
  const route = useRouter();
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
              <button
                className="cursor-pointer rounded-lg bg-white px-8 py-4 font-bold text-black transition-colors hover:bg-gray-200"
                onClick={() => route.push('/guide/getting-started')}
              >
                Get Started Now
              </button>
              <button
                className="cursor-pointer rounded-lg border border-white/20 bg-transparent px-8 py-4 font-bold text-white transition-colors hover:bg-white/10"
                onClick={() => {
                  window.open('https://github.com/hyperse-io/hps', '_blank');
                }}
              >
                View on GitHub
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
