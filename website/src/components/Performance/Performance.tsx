'use client';

import React, { useState } from 'react';
import { Activity, ArrowUpRight, Cpu, Layers, Timer, Zap } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type MetricType = 'startup' | 'hmr' | 'build';

const metrics: Record<
  MetricType,
  {
    label: string;
    description: string;
    icon: React.ElementType;
    data: { name: string; value: number; color: string; unit: string }[];
    details: string;
  }
> = {
  startup: {
    label: 'Dev Server Startup',
    description:
      'Time to interactive for a large scale application (50k+ modules).',
    icon: Timer,
    details:
      "HPS leverages Rspack's lazy compilation and Rust-based core to provide near-instant server starts, regardless of project size.",
    data: [
      { name: 'Webpack', value: 45.5, color: '#3b82f6', unit: 's' },
      { name: 'Vite', value: 2.5, color: '#a855f7', unit: 's' },
      { name: 'HPS', value: 0.8, color: '#06b6d4', unit: 's' },
    ],
  },
  hmr: {
    label: 'HMR Speed',
    description: 'Hot Module Replacement time when modifying a root component.',
    icon: Activity,
    details:
      'Incremental compilation in HPS is extremely efficient. Changes are reflected in the browser typically within double-digit milliseconds.',
    data: [
      { name: 'Webpack', value: 1200, color: '#3b82f6', unit: 'ms' },
      { name: 'Vite', value: 150, color: '#a855f7', unit: 'ms' },
      { name: 'HPS', value: 45, color: '#06b6d4', unit: 'ms' },
    ],
  },
  build: {
    label: 'Production Build',
    description:
      'Full production build time including minification and tree-shaking.',
    icon: Layers,
    details:
      'Multi-threaded compilation and minification via SWC allow HPS to generate optimized production assets 10x faster than traditional tools.',
    data: [
      { name: 'Webpack', value: 85, color: '#3b82f6', unit: 's' },
      { name: 'Vite (Rollup)', value: 42, color: '#a855f7', unit: 's' },
      { name: 'HPS', value: 6.5, color: '#06b6d4', unit: 's' },
    ],
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-panel rounded-lg border border-white/10 bg-gray-900/90 p-3 shadow-xl backdrop-blur-xl">
        <p className="mb-1 font-medium text-gray-200">{data.name}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-cyan-400">{data.value}</span>
          <span className="font-mono text-sm text-gray-400">{data.unit}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const Performance: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('startup');
  const currentMetric = metrics[activeMetric];

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-black/40 py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold tracking-wide text-cyan-300 uppercase">
              Benchmark
            </span>
          </div>
          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Unmatched Performance
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-400">
            Performance isn't just a feature; it's our core philosophy. HPS is
            engineered to eliminate bottlenecks in your development lifecycle.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Controls & Info */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 p-1">
              {(Object.keys(metrics) as MetricType[]).map((key) => {
                const metric = metrics[key];
                const isActive = activeMetric === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveMetric(key)}
                    className={`group flex items-center gap-4 rounded-lg px-4 py-4 text-left transition-all duration-300 ${
                      isActive
                        ? 'border border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/10 shadow-lg'
                        : 'border border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`rounded-lg p-2 ${isActive ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400 group-hover:text-white'}`}
                    >
                      <metric.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div
                        className={`font-semibold ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}
                      >
                        {metric.label}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        {key === 'hmr'
                          ? 'Update Speed'
                          : key === 'startup'
                            ? 'Ready Time'
                            : 'Compilation'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="glass-panel mt-auto rounded-xl border border-white/10 p-6">
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
                <Cpu className="h-4 w-4 text-cyan-400" />
                Why is HPS faster?
              </h4>
              <p className="mb-4 text-sm leading-relaxed text-gray-400">
                {currentMetric.details}
              </p>
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
                Powered by Rust & Rspack
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-8">
            <div className="relative flex h-[500px] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1121] p-6 shadow-2xl sm:p-8">
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {currentMetric.label} Comparison
                  </h3>
                  <p className="text-sm text-gray-400">
                    {currentMetric.description}
                  </p>
                </div>
                <div className="hidden items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 font-mono text-xs text-gray-500 sm:flex">
                  Lower is better{' '}
                  <ArrowUpRight className="h-3 w-3 rotate-180" />
                </div>
              </div>

              <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentMetric.data}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                    barGap={20}
                    barSize={48}
                  >
                    <CartesianGrid
                      horizontal={false}
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      width={100}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[0, 6, 6, 0]}
                      animationDuration={1000}
                    >
                      {currentMetric.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend/Summary for chart */}
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6 text-sm">
                <div className="flex gap-6">
                  {currentMetric.data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-400">{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="hidden text-right sm:block">
                  <span className="text-gray-500">Test Project: </span>
                  <span className="font-mono text-gray-300">
                    50k Modules / M1 Max
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
