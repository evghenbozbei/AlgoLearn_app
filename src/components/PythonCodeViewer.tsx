import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface PythonCodeViewerProps {
  code: string;
  activeLine?: number;
  highlightedLines?: number[];
  title?: string;
}

export const PythonCodeViewer: React.FC<PythonCodeViewerProps> = ({
  code,
  activeLine,
  highlightedLines = [],
  title = 'Python 3.12'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple and robust syntax token parser for Python
  const renderHighlightedLine = (lineText: string) => {
    if (lineText.trim().startsWith('#')) {
      return <span className="text-emerald-400/80 italic">{lineText}</span>;
    }

    // Split tokens while preserving comments and strings
    const commentIdx = lineText.indexOf('#');
    let codePart = lineText;
    let commentPart = '';
    if (commentIdx !== -1) {
      codePart = lineText.substring(0, commentIdx);
      commentPart = lineText.substring(commentIdx);
    }

    // Token replace
    const tokens = codePart.split(/(\b(?:def|return|if|elif|else|while|for|in|class|import|from|try|except|raise|with|as|and|or|not|is|None|True|False|break|continue|pass|lambda|yield)\b|[0-9]+|"[^"]*"|'[^']*'|[{}()[\],:;=+\-*/%<>!]+)/g);

    return (
      <>
        {tokens.map((token, i) => {
          if (!token) return null;
          const keywords = [
            'def', 'return', 'if', 'elif', 'else', 'while', 'for', 'in',
            'class', 'import', 'from', 'try', 'except', 'raise', 'with', 'as',
            'and', 'or', 'not', 'is', 'None', 'True', 'False', 'break', 'continue', 'pass'
          ];
          if (keywords.includes(token)) {
            return <span key={i} className="text-pink-400 font-semibold">{token}</span>;
          }
          if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
            return <span key={i} className="text-amber-300">{token}</span>;
          }
          if (/^[0-9]+$/.test(token)) {
            return <span key={i} className="text-cyan-300">{token}</span>;
          }
          if (token.includes('(') || token.includes(')') || token.includes('[') || token.includes(']')) {
            return <span key={i} className="text-slate-300">{token}</span>;
          }
          if (token.startsWith('__') && token.endsWith('__')) {
            return <span key={i} className="text-purple-400">{token}</span>;
          }
          return <span key={i} className="text-slate-100">{token}</span>;
        })}
        {commentPart && <span className="text-emerald-400/80 italic">{commentPart}</span>}
      </>
    );
  };

  const lines = code.trim().split('\n');

  return (
    <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl my-3">
      {/* Code Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/80 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-mono">
          <Terminal size={14} className="text-indigo-400" />
          <span className="font-semibold text-slate-300">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          id="copy-code-btn"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs active:scale-95"
          title="Скопировать код"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
        </button>
      </div>

      {/* Code Body */}
      <div className="p-3 overflow-x-auto text-xs leading-relaxed font-mono select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isCurrent = activeLine === lineNum;
              const isHighlighted = highlightedLines.includes(lineNum);

              return (
                <tr
                  key={idx}
                  className={`transition-colors duration-150 rounded ${
                    isCurrent
                      ? 'bg-indigo-500/25 border-l-2 border-indigo-400 font-semibold'
                      : isHighlighted
                      ? 'bg-amber-500/15'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  <td className="w-8 pr-3 text-right text-slate-600 select-none text-[11px] align-top py-0.5">
                    {lineNum}
                  </td>
                  <td className="text-slate-100 whitespace-pre pl-1 py-0.5">
                    {renderHighlightedLine(line)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
