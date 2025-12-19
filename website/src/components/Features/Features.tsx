import React from 'react';
import {
  CloudUpload,
  Globe,
  Layers,
  Settings,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const features = [
  {
    title: 'Rspack Core',
    description:
      'Built on top of the ultra-fast Rust-based bundler Rspack, providing Webpack-compatible API with Vite-like speed.',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
  },
  {
    title: 'Minimal Configuration',
    description:
      "Start developing immediately with sensible defaults. HPS handles the complex setup so you don't have to.",
    icon: Settings,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    title: 'Built-in Mock',
    description:
      "Integrated API mocking capabilities allow you to develop frontend features even when the backend isn't ready.",
    icon: Layers,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
  },
  {
    title: 'One-Click Publish',
    description:
      'Streamlined build and deployment pipeline commands. Ship your modern web applications with confidence.',
    icon: CloudUpload,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
  },
  {
    title: 'Module Federation',
    description:
      'Native support for Module Federation allows you to build scalable micro-frontend architectures effortlessly.',
    icon: Globe,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
  },
  {
    title: 'Type Safe',
    description:
      'Written in TypeScript with full type definitions included. Enjoy a robust developer experience with autocompletion.',
    icon: ShieldCheck,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="relative overflow-hidden py-24">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute top-1/2 left-0 h-1/2 w-1/3 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            HPS provides a comprehensive toolchain for modern web development.
            Stop wasting time on configuration and start building.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-panel group rounded-2xl border border-white/5 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <div
                className={`h-12 w-12 rounded-lg ${feature.bg} ${feature.border} mb-6 flex items-center justify-center border transition-transform duration-300 group-hover:scale-110`}
              >
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white transition-colors group-hover:text-cyan-400">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
