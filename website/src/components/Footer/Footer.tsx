import React from 'react';
import { Icon } from '@iconify/react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#020617] pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Icon icon="mdi:terminal" className="size-6 text-cyan-500" />
              <span className="text-xl font-bold text-white">HPS</span>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              The high-performance build tool for the modern web. Built with
              Rspack.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/hyperse-io"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Icon icon="mdi:github" className="size-6" />
              </a>
              <a
                href="https://x.com/hyperse_net"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Icon icon="mdi:twitter" className="size-6" />
              </a>
              <a
                href="https://facebook.com/hyperse_net"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Icon icon="mdi:facebook" className="size-6" />
              </a>
              <a
                href="https://discord.com/invite/tj3ahjXXzM"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Icon icon="mdi:discord" className="size-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Hyperse</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://github.com/hyperse-io"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-cyan-400"
                >
                  Hyperse.io
                </a>
              </li>
              <li>
                <a
                  href="https://www.hyperse.net"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-cyan-400"
                >
                  Hyperse.net
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="/hps/resources/about"
                  className="transition-colors hover:text-cyan-400"
                >
                  About Hyperse
                </a>
              </li>
              <li>
                <a
                  href="https://www.hyperse.net/blog"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-cyan-400"
                >
                  Hyperse Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Related Projects</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://hyperse-io.github.io/wizard/"
                  className="transition-colors hover:text-cyan-400"
                >
                  Wizard
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/hyperse-io/pipeline"
                  className="transition-colors hover:text-cyan-400"
                >
                  Pipeline
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/hyperse-io/ts-node"
                  className="transition-colors hover:text-cyan-400"
                >
                  TS Node
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/hyperse-io/code-inspector"
                  className="transition-colors hover:text-cyan-400"
                >
                  Code Inspector
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Hyperse Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
