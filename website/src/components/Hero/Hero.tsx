'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Box, Rocket, Zap } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-transparent',
    secondary:
      'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10',
    outline:
      'border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Hero: React.FC = () => {
  const route = useRouter();
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background Decor */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full max-w-7xl -translate-x-1/2">
        <div className="animate-pulse-slow absolute top-20 left-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-[100px]"></div>
        <div
          className="animate-pulse-slow absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-purple-500/20 blur-[100px]"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1">
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
              <span className="text-xs font-semibold tracking-wide text-cyan-300 uppercase">
                Rspack Powered
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-7xl">
              <span className="block text-white">Build the Web</span>
              <span className="animate-gradient-x block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text pb-2 text-transparent">
                At Light Speed
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-400 lg:mx-0">
              HPS (@hyperse-io/hps) is the next-generation build tool designed
              for modern web apps. Built on Rspack, it delivers instant startup,
              lightning-fast HMR, and zero-config deployment.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="group w-full sm:w-auto"
                onClick={() => {
                  route.push('/guide/introduction');
                }}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => route.push('/guide/getting-started')}
              >
                Read Documentation
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8 text-sm font-medium text-gray-500 lg:justify-start">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>10x Faster Build</span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-blue-400" />
                <span>Zero Config</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4 text-green-400" />
                <span>Built-in Mock</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-lg flex-1 lg:max-w-none">
            <div className="animate-float relative">
              {/* Decorative border glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 opacity-30 blur"></div>
              <div className="relative">
                <CodeBlock code="npx hps serve evolve" />

                {/* Floating status card */}
                <div className="glass-panel absolute -right-6 -bottom-6 hidden rounded-xl border border-white/10 p-4 shadow-2xl sm:block">
                  <div className="mb-2 flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    <span className="font-mono text-xs text-gray-400">
                      Build Status
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">45ms</span>
                    <span className="text-xs font-medium text-green-400">
                      HMR Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
