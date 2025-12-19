'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

export const CodeBlock: React.FC<{ code: string; language?: string }> = ({
  code,
  language = 'bash',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
            <div className="h-3 w-3 rounded-full bg-green-500/50"></div>
          </div>
          <span className="ml-3 flex items-center gap-1 font-mono text-xs text-gray-400">
            <Terminal className="h-3 w-3" />
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1 text-gray-400 transition-colors hover:text-white"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-5">
        <pre className="font-mono text-sm text-gray-300">
          <code>
            <span className="text-purple-400">$</span> {code}
          </code>
        </pre>
      </div>
    </div>
  );
};
