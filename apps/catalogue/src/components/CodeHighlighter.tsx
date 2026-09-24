"use client";

import React, { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";

interface CodeHighlighterProps {
  code: string;
  filename?: string;
  language?: string;
  maxHeight?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightLine(rawLine: string): string {
  if (!rawLine.trim()) return "&nbsp;";

  // Token storage to prevent double-replacement
  const tokens: { key: string; html: string }[] = [];
  let tokenCounter = 0;

  function pushToken(content: string, className: string): string {
    const key = `@@@TOKEN_${tokenCounter++}@@@`;
    tokens.push({
      key,
      html: `<span class="${className}">${escapeHtml(content)}</span>`,
    });
    return key;
  }

  let line = rawLine;

  // 1. Single-line Comments (// ...)
  line = line.replace(/(\/\/.*$)/, (m) =>
    pushToken(m, "text-neutral-500 italic")
  );

  // 2. String literals ("...", '...', `...`)
  line = line.replace(/(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, (m) =>
    pushToken(m, "text-emerald-400 font-medium")
  );

  // 3. JSX Tags: </TagName> or <TagName (e.g. <button, </button>, <div, <motion.div)
  line = line.replace(/(<\/?[A-Za-z0-9_.-]+)/g, (m) =>
    pushToken(m, "text-sky-400 font-semibold")
  );

  // 4. Keywords
  line = line.replace(
    /\b(import|export|default|from|const|let|var|function|return|if|else|switch|case|break|interface|type|extends|implements|as|typeof|async|await|new|this|throw|try|catch|finally)\b/g,
    (m) => pushToken(m, "text-rose-400 font-semibold")
  );

  // 5. TypeScript / React Types
  line = line.replace(
    /\b(string|number|boolean|any|void|unknown|never|object|ReactNode|ReactElement|FC|HTMLButtonElement|HTMLDivElement|HTMLInputElement|ChangeEvent|MouseEvent)\b/g,
    (m) => pushToken(m, "text-teal-300 font-medium")
  );

  // 6. Booleans & Constants
  line = line.replace(/\b(true|false|null|undefined)\b/g, (m) =>
    pushToken(m, "text-amber-400 font-semibold")
  );

  // 7. React Hooks & React identifiers
  line = line.replace(/\b(React|useState|useEffect|useMemo|useCallback|useRef|useContext)\b/g, (m) =>
    pushToken(m, "text-cyan-300 font-medium")
  );

  // 8. JSX Attribute Names (e.g. className=, onClick=, variant=)
  line = line.replace(/\b([a-zA-Z0-9_-]+)(?=\s*=)/g, (m) =>
    pushToken(m, "text-yellow-300")
  );

  // 9. Numbers
  line = line.replace(/\b(\d+(?:\.\d+)?)\b/g, (m) =>
    pushToken(m, "text-orange-400")
  );

  // 10. Operators and special punctuation
  line = line.replace(/(=>|===|!==|==|!=|<=|>=|&&|\|\|)/g, (m) =>
    pushToken(m, "text-purple-400 font-bold")
  );

  // Escape any remaining plain text before re-injecting tokens
  // Split by placeholder pattern
  let parts = line.split(/(@@@TOKEN_\d+@@@)/);
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i].startsWith("@@@TOKEN_")) {
      parts[i] = escapeHtml(parts[i]);
    }
  }
  line = parts.join("");

  // Re-inject saved tokens
  for (const t of tokens) {
    line = line.replace(t.key, t.html);
  }

  return line;
}

export function CodeHighlighter({
  code,
  filename = "Component.tsx",
  language = "TSX",
  maxHeight = "max-h-[520px]",
}: CodeHighlighterProps) {
  const [copied, setCopied] = useState(false);

  const lines = code.trim().split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#222222] bg-[#0A0D14] shadow-2xl transition-all">
      {/* Code Window Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F1420] border-b border-[#1E2536]">
        <div className="flex items-center gap-3">
          {/* Mac Traffic Light Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block" />
          </div>

          {/* Filename & Language Badge */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <Code2 className="size-3.5 text-neutral-400" />
            <span className="text-neutral-300 font-medium">{filename}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#1A2333] text-[#38BDF8] border border-[#38BDF8]/20">
              {language}
            </span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-[#161D2B] hover:bg-[#1E283A] text-neutral-300 hover:text-white border border-white/5 transition-all"
          title="Copy source code"
        >
          {copied ? (
            <>
              <Check className="size-3 text-[#16C89E]" />
              <span className="text-[#16C89E] font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Lines with Gutter */}
      <div className={`overflow-x-auto ${maxHeight} p-4 font-mono text-xs leading-relaxed`}>
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((lineText, idx) => {
              const lineHtml = highlightLine(lineText);
              const lineNum = idx + 1;
              return (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  {/* Line Number Column */}
                  <td className="w-10 select-none text-right pr-4 text-neutral-600 font-mono text-[11px] align-top">
                    {lineNum}
                  </td>
                  {/* Highlighted Code Column */}
                  <td className="text-neutral-200 whitespace-pre align-top font-mono">
                    <span dangerouslySetInnerHTML={{ __html: lineHtml }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
