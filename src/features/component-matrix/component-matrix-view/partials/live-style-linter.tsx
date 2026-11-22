import { useMemo, useState } from 'react';
import { AlertTriangle, Check, CheckCircle2, Copy, ShieldAlert } from 'lucide-react';
import { LINT_PRESETS } from '../../../../shared/data/components';
import { ESLINT_NO_INLINE_STYLE_CONFIG } from '../../../../shared/data/comparison';
import { lintComponentSnippet } from '../../../../shared/utils/calculations';

export interface LiveStyleLinterProps {
  onNotify: (message: string) => void;
}

export function LiveStyleLinter({ onNotify }: LiveStyleLinterProps) {
  const [activePresetId, setActivePresetId] = useState<string>(LINT_PRESETS[0].id);
  const [linterSource, setLinterSource] = useState<string>(LINT_PRESETS[0].code);
  const [copiedEslint, setCopiedEslint] = useState(false);

  const lintIssues = useMemo(() => lintComponentSnippet(linterSource), [linterSource]);
  const errorCount = lintIssues.filter((i) => i.severity === 'error').length;
  const warningCount = lintIssues.filter((i) => i.severity === 'warning').length;

  const handleLoadPreset = (presetId: string) => {
    const found = LINT_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePresetId(found.id);
    setLinterSource(found.code);
  };

  const handleCopyEslintConfig = async () => {
    try {
      await navigator.clipboard.writeText(ESLINT_NO_INLINE_STYLE_CONFIG);
      setCopiedEslint(true);
      onNotify('Copied ESLint zero-inline-style flat config');
      setTimeout(() => setCopiedEslint(false), 1800);
    } catch {
      onNotify('Clipboard unavailable in this browser context.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <fieldset
          aria-label="Load component linter preset"
          className="inline-flex flex-wrap items-center gap-1 rounded-md border border-[#222B36] bg-[#11161D] p-1"
        >
          {LINT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset.id)}
              className={`shrink-0 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
                activePresetId === preset.id
                  ? 'bg-[#161D26] text-[#34D399]'
                  : 'text-[#8B949E] hover:text-[#E6EDF3]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </fieldset>

        <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
          <span className={errorCount > 0 ? 'text-[#F87171]' : 'text-[#34D399]'}>
            {errorCount} error{errorCount === 1 ? '' : 's'}
          </span>
          <span aria-hidden="true" className="text-[#303C4B]">
            ·
          </span>
          <span className={warningCount > 0 ? 'text-[#F59E0B]' : 'text-[#8B949E]'}>
            {warningCount} warning{warningCount === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        <section className="border border-[#222B36] bg-[#11161D] xl:col-span-7">
          <div className="flex items-center justify-between border-b border-[#222B36] bg-[#161D26] px-4 py-3">
            <label htmlFor="jsx-linter-editor" className="text-xs font-medium text-[#E6EDF3]">
              Design System Component Source (TSX)
            </label>
            <span className="text-[11px] text-[#8B949E]">
              Live checks: no inline style, prop leaks, Panda v2 APIs
            </span>
          </div>
          <textarea
            id="jsx-linter-editor"
            value={linterSource}
            onChange={(e) => {
              setActivePresetId('custom');
              setLinterSource(e.target.value);
            }}
            rows={16}
            spellCheck={false}
            className="block w-full resize-y bg-[#0B0F14] p-4 font-mono text-xs leading-relaxed text-[#E6EDF3] focus:outline-none"
          />
        </section>

        <section className="border border-[#222B36] bg-[#11161D] xl:col-span-5">
          <div className="border-b border-[#222B36] bg-[#161D26] px-4 py-3">
            <h2 className="text-xs font-semibold text-[#E6EDF3]">Lint &amp; Policy Diagnostics</h2>
          </div>

          {lintIssues.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <CheckCircle2 className="mx-auto h-7 w-7 text-[#10B981]" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-[#34D399]">
                Zero Inline-Style &amp; Panda v2 Violations
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#8B949E]">
                This component relies strictly on data-* attributes, recipe props, or Panda JSX
                wrappers and omits inline style props cleanly.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#222B36]">
              {lintIssues.map((issue, i) => (
                <div key={`${issue.line}-${issue.rule}-${i}`} className="px-4 py-3.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {issue.severity === 'error' ? (
                        <ShieldAlert
                          className="h-3.5 w-3.5 shrink-0 text-[#F87171]"
                          aria-hidden="true"
                        />
                      ) : (
                        <AlertTriangle
                          className="h-3.5 w-3.5 shrink-0 text-[#F59E0B]"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`font-mono font-medium ${
                          issue.severity === 'error' ? 'text-[#F87171]' : 'text-[#F59E0B]'
                        }`}
                      >
                        {issue.rule}
                      </span>
                    </div>
                    <span className="font-mono tabular-nums text-[#6E7681]">
                      Ln {issue.line}, Col {issue.column}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[#E6EDF3]">{issue.message}</p>
                  {issue.snippet && (
                    <pre className="mt-2 overflow-x-auto bg-[#090C10] px-2.5 py-1.5 font-mono text-[11px] text-[#9CA7B5]">
                      <code>{issue.snippet}</code>
                    </pre>
                  )}
                  <p className="mt-2 leading-relaxed text-[#34D399]">Fix: {issue.suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="border border-[#222B36] bg-[#11161D]">
        <div className="flex items-center justify-between border-b border-[#222B36] bg-[#161D26] px-5 py-3">
          <h2 className="text-xs font-semibold text-[#E6EDF3]">
            CI Enforcement Rule: eslint.config.mjs (Zero Inline Style Gate)
          </h2>
          <button
            type="button"
            onClick={handleCopyEslintConfig}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border border-[#222B36] bg-[#11161D] px-2.5 py-1 text-xs font-medium text-[#E6EDF3] transition-colors hover:border-[#344253]"
          >
            {copiedEslint ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#34D399]" aria-hidden="true" />
                Copied Config
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#8B949E]" aria-hidden="true" />
                Copy ESLint Config
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto bg-[#0B0F14] p-5 text-xs leading-relaxed text-[#C9D1D9]">
          <code>{ESLINT_NO_INLINE_STYLE_CONFIG}</code>
        </pre>
      </section>
    </div>
  );
}
