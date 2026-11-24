import React from 'react';

interface CodeBlockProps {
  code: string;
}

const KEYWORDS = new Set([
  'let',
  'const',
  'var',
  'if',
  'else',
  'for',
  'while',
  'return',
  'true',
  'false',
  'function',
]);

function highlightLine(line: string): React.ReactNode[] {
  const tokens = line.split(
    /("(?:[^"\\]|\\.)*"|\b(?:let|const|var|if|else|for|while|return|true|false|function|console|log|filter|map)\b|\b\d+\b)/g
  );

  return tokens.map((token, idx) => {
    if (!token) return null;

    if (token.startsWith('"') && token.endsWith('"')) {
      return (
        <span key={idx} className="text-emerald-300">
          {token}
        </span>
      );
    }

    if (KEYWORDS.has(token)) {
      return (
        <span key={idx} className="text-violet-300 font-medium">
          {token}
        </span>
      );
    }

    if (token === 'console' || token === 'log' || token === 'filter' || token === 'map') {
      return (
        <span key={idx} className="text-sky-300">
          {token}
        </span>
      );
    }

    if (/^\d+$/.test(token)) {
      return (
        <span key={idx} className="text-amber-300">
          {token}
        </span>
      );
    }

    return (
      <span key={idx} className="text-slate-200">
        {token}
      </span>
    );
  });
}

export function CodeBlock({ code }: CodeBlockProps) {
  const lines = code.split('\n');

  return (
    <div className="my-5 overflow-x-auto rounded-xl border border-indigo-500/25 bg-[#050814] p-4 shadow-inner">
      <pre className="font-mono text-sm leading-relaxed sm:text-[15px]">
        <code>
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="flex">
              <span
                aria-hidden="true"
                className="mr-4 w-5 shrink-0 select-none text-right text-slate-600 tabular-nums"
              >
                {lineIndex + 1}
              </span>
              <span className="whitespace-pre">{highlightLine(line)}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
