import { useState } from 'react';
import { Check, Copy, Download, X } from 'lucide-react';

export interface ExportBriefModalProps {
  markdown: string;
  onClose: () => void;
  onNotify: (message: string) => void;
}

export function ExportBriefModal({ markdown, onClose, onNotify }: ExportBriefModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      onNotify('Copied Architecture Brief Markdown to clipboard');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      onNotify('Clipboard unavailable in this browser context.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'park-ui-panda-v2-architecture-brief.md';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    onNotify('Downloaded park-ui-panda-v2-architecture-brief.md');
  };

  return (
    <dialog
      open
      aria-modal="true"
      aria-labelledby="export-brief-title"
      className="fixed inset-0 z-50 m-0 flex h-screen w-screen max-w-none items-center justify-center bg-transparent p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Dismiss modal backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/75"
      />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col border border-[#222B36] bg-[#11161D]">
        <div className="flex items-center justify-between border-b border-[#222B36] px-5 py-4">
          <div>
            <h2 id="export-brief-title" className="text-base font-semibold text-[#F0F6FC]">
              Architecture Decision Brief (Markdown RFC)
            </h2>
            <p className="mt-0.5 text-xs text-[#8B949E]">
              Includes your active component scale, effort estimate, open blockers, and
              zero-inline-style ESLint config.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="rounded-sm p-1.5 text-[#8B949E] transition-colors hover:bg-[#161D26] hover:text-[#E6EDF3] focus-visible:outline-2 focus-visible:outline-[#10B981]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <pre className="flex-1 overflow-auto bg-[#0B0F14] p-5 font-mono text-xs leading-relaxed text-[#C9D1D9]">
          <code>{markdown}</code>
        </pre>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#222B36] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 whitespace-nowrap rounded-md border border-[#222B36] bg-[#090C10] px-4 py-2 text-xs font-medium text-[#C9D1D9] transition-colors hover:border-[#344253]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-[#222B36] bg-[#161D26] px-4 py-2 text-xs font-medium text-[#E6EDF3] transition-colors hover:border-[#344253]"
          >
            <Download className="h-3.5 w-3.5 text-[#10B981]" aria-hidden="true" />
            Download .md
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-[#10B981] px-4 py-2 text-xs font-semibold text-[#06130E] transition-colors hover:bg-[#34D399]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Copied Markdown
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                Copy Markdown
              </>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}
