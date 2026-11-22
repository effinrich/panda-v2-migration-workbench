import { useMemo, useState } from 'react';
import { Check, CheckSquare, Copy, Square } from 'lucide-react';
import type {
  BlockerCategory,
  BlockerItem,
  BlockerSeverity,
} from '../../../shared/types/migration';
import { MIGRATION_BLOCKERS } from '../../../shared/data/blockers';
import { CATEGORY_FILTER_OPTIONS, SEVERITY_FILTER_OPTIONS } from './consts';
import { getSeverityTextClass } from './utils';

export interface BlockersViewProps {
  mitigatedBlockers: string[];
  onToggleMitigated: (id: string) => void;
  onNotify: (message: string) => void;
}

export function BlockersView({
  mitigatedBlockers,
  onToggleMitigated,
  onNotify,
}: BlockersViewProps) {
  const [severityFilter, setSeverityFilter] = useState<'All' | BlockerSeverity>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | BlockerCategory>('All');
  const [selectedId, setSelectedId] = useState<string>(MIGRATION_BLOCKERS[0].id);
  const [diffLayout, setDiffLayout] = useState<'split' | 'stacked'>('split');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredBlockers = useMemo(() => {
    return MIGRATION_BLOCKERS.filter((item) => {
      if (severityFilter !== 'All' && item.severity !== severityFilter) {
        return false;
      }
      if (categoryFilter !== 'All' && item.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [severityFilter, categoryFilter]);

  const activeBlocker: BlockerItem | undefined =
    filteredBlockers.find((b) => b.id === selectedId) ?? filteredBlockers[0];

  const handleCopyV2 = async (blocker: BlockerItem) => {
    try {
      await navigator.clipboard.writeText(blocker.v2Code);
      setCopiedId(blocker.id);
      onNotify(`Copied Panda v2 snippet for ${blocker.title}`);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      onNotify('Clipboard unavailable in this browser context.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[#222B36] pb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#F0F6FC]">
              Breaking-Change Blockers &amp; Code Diffs
            </h1>
            <p className="mt-1 text-sm text-[#8B949E]">
              Every concrete blocker migrating Open-Code Park UI recipes to Panda v2 under a strict
              zero-inline-style lint gate.
            </p>
          </div>
          <p className="whitespace-nowrap font-mono text-xs tabular-nums text-[#8B949E]">
            {mitigatedBlockers.length} of {MIGRATION_BLOCKERS.length} mitigated
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <fieldset
              aria-label="Filter by severity"
              className="inline-flex items-center gap-1 rounded-md border border-[#222B36] bg-[#11161D] p-1"
            >
              {SEVERITY_FILTER_OPTIONS.map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(sev)}
                  className={`shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#10B981] ${
                    severityFilter === sev
                      ? 'bg-[#161D26] text-[#34D399]'
                      : 'text-[#8B949E] hover:text-[#E6EDF3]'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </fieldset>

            <fieldset
              aria-label="Filter by category"
              className="inline-flex flex-wrap items-center gap-1 rounded-md border border-[#222B36] bg-[#11161D] p-1"
            >
              {CATEGORY_FILTER_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#10B981] ${
                    categoryFilter === cat
                      ? 'bg-[#161D26] text-[#34D399]'
                      : 'text-[#8B949E] hover:text-[#E6EDF3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </fieldset>
          </div>

          <fieldset
            aria-label="Diff view layout"
            className="inline-flex items-center gap-1 rounded-md border border-[#222B36] bg-[#11161D] p-1"
          >
            <button
              type="button"
              onClick={() => setDiffLayout('split')}
              className={`shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                diffLayout === 'split'
                  ? 'bg-[#161D26] text-[#34D399]'
                  : 'text-[#8B949E] hover:text-[#E6EDF3]'
              }`}
            >
              Side-by-Side Diff
            </button>
            <button
              type="button"
              onClick={() => setDiffLayout('stacked')}
              className={`shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                diffLayout === 'stacked'
                  ? 'bg-[#161D26] text-[#34D399]'
                  : 'text-[#8B949E] hover:text-[#E6EDF3]'
              }`}
            >
              Stacked Diff
            </button>
          </fieldset>
        </div>
      </div>

      {!activeBlocker ? (
        <div className="border border-[#222B36] bg-[#11161D] px-6 py-12 text-center">
          <p className="text-sm font-medium text-[#E6EDF3]">
            No blockers match the selected severity and category filters.
          </p>
          <p className="mt-1 text-xs text-[#8B949E]">
            Reset filters to view all {MIGRATION_BLOCKERS.length} Panda CSS v2 migration blockers.
          </p>
          <button
            type="button"
            onClick={() => {
              setSeverityFilter('All');
              setCategoryFilter('All');
            }}
            className="mt-4 rounded-md bg-[#10B981] px-4 py-2 text-xs font-semibold text-[#06130E] transition-colors hover:bg-[#34D399]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          <aside className="divide-y divide-[#222B36] border border-[#222B36] bg-[#11161D] xl:col-span-4">
            {filteredBlockers.map((item) => {
              const isSelected = item.id === activeBlocker.id;
              const isDone = mitigatedBlockers.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`block w-full px-4 py-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#10B981] ${
                    isSelected ? 'bg-[#161D26]' : 'hover:bg-[#161D26]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-[#8B949E]">
                      <span className="font-mono tabular-nums text-[#6E7681]">{item.index}.</span>
                      <span className={getSeverityTextClass(item.severity)}>{item.severity}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.category}</span>
                    </div>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        isDone ? 'text-[#34D399]' : 'text-[#6E7681]'
                      }`}
                    >
                      {isDone ? 'Mitigated' : `${item.automatablePct}% auto`}
                    </span>
                  </div>
                  <p
                    className={`mt-1.5 text-sm font-medium leading-snug ${
                      isSelected ? 'text-[#F0F6FC]' : 'text-[#C9D1D9]'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-[#8B949E]">{item.affectedShare}</p>
                </button>
              );
            })}
          </aside>

          <section className="border border-[#222B36] bg-[#11161D] xl:col-span-8">
            <div className="flex flex-col gap-4 border-b border-[#222B36] px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8B949E]">
                  <span className="font-mono tabular-nums">Blocker {activeBlocker.index}</span>
                  <span aria-hidden="true">·</span>
                  <span className={getSeverityTextClass(activeBlocker.severity)}>
                    Severity: {activeBlocker.severity}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeBlocker.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-[#E6EDF3]">
                    ~{activeBlocker.automatablePct}% codemod-automatable
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-[#F0F6FC]">{activeBlocker.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#9CA7B5]">
                  {activeBlocker.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onToggleMitigated(activeBlocker.id)}
                className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md border px-3.5 py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#10B981] ${
                  mitigatedBlockers.includes(activeBlocker.id)
                    ? 'border-[#10B981]/50 bg-[#10B981]/15 text-[#34D399]'
                    : 'border-[#222B36] bg-[#090C10] text-[#E6EDF3] hover:border-[#344253]'
                }`}
              >
                {mitigatedBlockers.includes(activeBlocker.id) ? (
                  <CheckSquare className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Square className="h-3.5 w-3.5 text-[#8B949E]" aria-hidden="true" />
                )}
                {mitigatedBlockers.includes(activeBlocker.id)
                  ? 'Marked Mitigated'
                  : 'Mark Mitigated'}
              </button>
            </div>

            <div className="grid grid-cols-1 divide-y divide-[#222B36] border-b border-[#222B36] md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="px-6 py-4">
                <h3 className="text-xs font-semibold text-[#E6EDF3]">Technical Root Cause</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#9CA7B5]">
                  {activeBlocker.rootCause}
                </p>
              </div>
              <div className="px-6 py-4">
                <h3 className="text-xs font-semibold text-[#E6EDF3]">
                  Panda v2 Engine &amp; Architecture Payoff
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#9CA7B5]">
                  {activeBlocker.v2EngineImpact}
                </p>
              </div>
            </div>

            <div className="border-b border-[#222B36]">
              <div className="flex items-center justify-between border-b border-[#222B36] bg-[#161D26] px-6 py-3">
                <span className="text-xs font-medium text-[#C9D1D9]">
                  Migration Diff · Blast Radius:{' '}
                  <span className="text-[#8B949E]">{activeBlocker.affectedShare}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyV2(activeBlocker)}
                  className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border border-[#222B36] bg-[#11161D] px-2.5 py-1 text-xs font-medium text-[#E6EDF3] transition-colors hover:border-[#344253] focus-visible:outline-2 focus-visible:outline-[#10B981]"
                >
                  {copiedId === activeBlocker.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#34D399]" aria-hidden="true" />
                      Copied v2
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#8B949E]" aria-hidden="true" />
                      Copy v2 Snippet
                    </>
                  )}
                </button>
              </div>

              <div
                className={`grid grid-cols-1 divide-y divide-[#222B36] ${
                  diffLayout === 'split' ? 'lg:grid-cols-2 lg:divide-x lg:divide-y-0' : ''
                }`}
              >
                <div className="min-w-0 bg-[#0B0F14]">
                  <div className="flex items-center justify-between border-b border-[#222B36] px-4 py-2 text-xs">
                    <span className="font-mono text-[#F87171]">
                      Before · {activeBlocker.v1Label}
                    </span>
                    <span className="font-mono text-[11px] text-[#6E7681]">Panda v1</span>
                  </div>
                  <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-[#C9D1D9]">
                    <code>{activeBlocker.v1Code}</code>
                  </pre>
                </div>

                <div className="min-w-0 bg-[#0B0F14]">
                  <div className="flex items-center justify-between border-b border-[#222B36] px-4 py-2 text-xs">
                    <span className="font-mono text-[#34D399]">
                      After · {activeBlocker.v2Label}
                    </span>
                    <span className="font-mono text-[11px] text-[#6E7681]">Panda v2</span>
                  </div>
                  <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-[#E6EDF3]">
                    <code>{activeBlocker.v2Code}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <h3 className="text-xs font-semibold text-[#E6EDF3]">
                Recommended Mitigation Sequence
              </h3>
              <ol className="mt-3 space-y-2.5">
                {activeBlocker.mitigationSteps.map((step, i) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 text-xs leading-relaxed text-[#9CA7B5]"
                  >
                    <span className="shrink-0 font-mono tabular-nums text-[#34D399]">
                      0{i + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
