import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { CodeSnippetProps } from '../types';

const CodeBlock: React.FC<CodeSnippetProps> = ({ language, code, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
        console.warn("Clipboard API not available");
        return;
    }
    try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (err) {
        console.error("Failed to copy", err);
    }
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-purple-800/50 bg-slate-900 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-purple-800/30">
        <div className="flex items-center gap-2 text-purple-300 text-xs font-mono">
          <Terminal size={14} />
          <span>{title || language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-purple-400 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm text-slate-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;