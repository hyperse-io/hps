import React from 'react';
import { Disc, Github, Terminal, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#020617] pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Terminal className="h-6 w-6 text-cyan-500" />
              <span className="text-xl font-bold text-white">HPS</span>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              The high-performance build tool for the modern web. Built with
              Rspack.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <Disc className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  Migration
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-cyan-400">
                  Partners
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Hyperse.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
