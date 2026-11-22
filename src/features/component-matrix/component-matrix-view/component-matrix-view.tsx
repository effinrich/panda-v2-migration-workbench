import { useMemo, useState } from 'react';
import { CheckSquare, Search, Square, X } from 'lucide-react';
import type {
  ComplexityTier,
  ComponentAuditItem,
  ComponentCategory,
  StyleLintStatus,
} from '../../../shared/types/migration';
import { COMPONENT_AUDIT_INVENTORY } from '../../../shared/data/components';
import { CATEGORIES, COMPLEXITY_FILTERS, LINT_STATUSES } from './consts';
import { getComplexityClass, getLintStatusClass } from './utils';
import { ComponentDetailPanel } from './partials/component-detail-panel';
import { LiveStyleLinter } from './partials/live-style-linter';

export interface ComponentMatrixViewProps {
  migratedComponents: string[];
  enforceNoInlineStyle: boolean;
  onToggleMigrated: (id: string) => void;
  onBulkToggleCategory: (ids: string[], markDone: boolean) => void;
  onNotify: (message: string) => void;
}

export function ComponentMatrixView({
  migratedComponents,
  enforceNoInlineStyle,
  onToggleMigrated,
  onBulkToggleCategory,
  onNotify,
}: ComponentMatrixViewProps) {
  const [activeTab, setActiveTab] = useState<'ledger' | 'linter'>('ledger');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | ComponentCategory>('All');
  const [lintFilter, setLintFilter] = useState<'All' | StyleLintStatus>('All');
  const [complexityFilter, setComplexityFilter] = useState<'All' | ComplexityTier>('All');
  const [selectedComponentId, setSelectedComponentId] = useState<string>('select');

  const filteredComponents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return COMPONENT_AUDIT_INVENTORY.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) {
        return false;
      }
      if (lintFilter !== 'All' && item.styleLintStatus !== lintFilter) {
        return false;
      }
      if (complexityFilter !== 'All' && item.complexity !== complexityFilter) {
        return false;
      }
      if (q) {
        const haystack =
          `${item.name} ${item.arkPrimitive} ${item.allowedStylingSurface} ${item.pandaV2Gotchas.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, categoryFilter, lintFilter, complexityFilter]);

  const selectedComponent: ComponentAuditItem | undefined =
    filteredComponents.find((c) => c.id === selectedComponentId) ??
    COMPONENT_AUDIT_INVENTORY.find((c) => c.id === selectedComponentId) ??
    filteredComponents[0];

  const remainingMinutes = useMemo(() => {
    return COMPONENT_AUDIT_INVENTORY.reduce((sum, item) => {
      if (migratedComponents.includes(item.id)) return sum;
      return sum + item.baseMinutes + (enforceNoInlineStyle ? item.lintAuditMinutes : 0);
    }, 0);
  }, [migratedComponents, enforceNoInlineStyle]);

  const dynamicVarCount = COMPONENT_AUDIT_INVENTORY.filter(
    (c) => c.styleLintStatus === 'Audit Dynamic Vars'
  ).length;

  const allFilteredDone =
    filteredComponents.length > 0 &&
    filteredComponents.every((c) => migratedComponents.includes(c.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[#222B36] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">
            42-Component Audit Matrix &amp; Style-Attribute Linter
          </h1>
          <p className="mt-1 text-sm text-[#8B949E]">
            Component-level Panda v2 recipe risk, Zag.js dynamic CSS variable audits, and live
            zero-inline-style JSX lint checks.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Component matrix workspace mode"
          className="inline-flex items-center gap-1 self-start rounded-md border border-[#222B36] bg-[#11161D] p-1 lg:self-auto"
        >
          <button
            role="tab"
            type="button"
            aria-selected={activeTab === 'ledger'}
            onClick={() => setActiveTab('ledger')}
            className={`shrink-0 whitespace-nowrap rounded-sm px-3.5 py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#10B981] ${
              activeTab === 'ledger'
                ? 'bg-[#161D26] text-[#34D399]'
                : 'text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            Component Audit Ledger ({COMPONENT_AUDIT_INVENTORY.length})
          </button>
          <button
            role="tab"
            type="button"
            aria-selected={activeTab === 'linter'}
            onClick={() => setActiveTab('linter')}
            className={`shrink-0 whitespace-nowrap rounded-sm px-3.5 py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#10B981] ${
              activeTab === 'linter'
                ? 'bg-[#161D26] text-[#34D399]'
                : 'text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            Live JSX Style-Attribute Linter
          </button>
        </div>
      </div>

      {activeTab === 'ledger' ? (
        <div className="space-y-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#8B949E]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono tabular-nums text-[#E6EDF3]">
                  {migratedComponents.length}/{COMPONENT_AUDIT_INVENTORY.length} migrated
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-[#34D399]">
                  {(remainingMinutes / 60).toFixed(1)}h remaining
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-[#F59E0B]">
                  {dynamicVarCount} Zag dynamic-var audits
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Policy:{' '}
                  <span className="text-[#E6EDF3]">
                    {enforceNoInlineStyle
                      ? 'Zero inline style (data-* / props / JSX wrappers only)'
                      : 'Standard migration'}
                  </span>
                </span>
              </div>

              {filteredComponents.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    onBulkToggleCategory(
                      filteredComponents.map((c) => c.id),
                      !allFilteredDone
                    )
                  }
                  className="shrink-0 whitespace-nowrap text-xs font-medium text-[#34D399] hover:underline focus-visible:outline-2 focus-visible:outline-[#10B981]"
                >
                  {allFilteredDone
                    ? `Unmark Visible (${filteredComponents.length})`
                    : `Mark Visible Migrated (${filteredComponents.length})`}
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-[220px] max-w-xs flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6E7681]"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search component, Ark primitive, gotcha..."
                  aria-label="Search components"
                  className="w-full rounded-md border border-[#222B36] bg-[#11161D] py-2 pl-9 pr-8 text-xs text-[#E6EDF3] placeholder:text-[#6E7681] focus:border-[#10B981] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E7681] hover:text-[#E6EDF3]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <fieldset
                aria-label="Filter by component category"
                className="inline-flex flex-wrap items-center gap-1 rounded-md border border-[#222B36] bg-[#11161D] p-1"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1 text-xs font-medium transition-colors ${
                      categoryFilter === cat
                        ? 'bg-[#161D26] text-[#34D399]'
                        : 'text-[#8B949E] hover:text-[#E6EDF3]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </fieldset>

              <fieldset
                aria-label="Filter by style lint status"
                className="inline-flex flex-wrap items-center gap-1 rounded-md border border-[#222B36] bg-[#11161D] p-1"
              >
                {LINT_STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setLintFilter(status)}
                    className={`shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1 text-xs font-medium transition-colors ${
                      lintFilter === status
                        ? 'bg-[#161D26] text-[#34D399]'
                        : 'text-[#8B949E] hover:text-[#E6EDF3]'
                    }`}
                  >
                    {status === 'All' ? 'All Lint States' : status}
                  </button>
                ))}
              </fieldset>

              <fieldset
                aria-label="Filter by complexity"
                className="inline-flex items-center gap-1 rounded-md border border-[#222B36] bg-[#11161D] p-1"
              >
                {COMPLEXITY_FILTERS.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setComplexityFilter(tier)}
                    className={`shrink-0 whitespace-nowrap rounded-sm px-2 py-1 text-xs font-medium transition-colors ${
                      complexityFilter === tier
                        ? 'bg-[#161D26] text-[#34D399]'
                        : 'text-[#8B949E] hover:text-[#E6EDF3]'
                    }`}
                  >
                    {tier === 'All' ? 'All Risk' : tier}
                  </button>
                ))}
              </fieldset>
            </div>
          </div>

          {filteredComponents.length === 0 ? (
            <div className="border border-[#222B36] bg-[#11161D] px-6 py-12 text-center">
              <p className="text-sm font-medium text-[#E6EDF3]">
                No components match your active filters.
              </p>
              <p className="mt-1 text-xs text-[#8B949E]">
                Clear search or category filters to inspect the full 42-component Park UI inventory.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('All');
                  setLintFilter('All');
                  setComplexityFilter('All');
                }}
                className="mt-4 rounded-md bg-[#10B981] px-4 py-2 text-xs font-semibold text-[#06130E] transition-colors hover:bg-[#34D399]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
              <div className="overflow-x-auto border border-[#222B36] bg-[#11161D] xl:col-span-8">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#222B36] bg-[#161D26] text-xs font-medium text-[#8B949E]">
                      <th className="w-10 px-3 py-3 text-center">Done</th>
                      <th className="px-3 py-3">Component</th>
                      <th className="px-3 py-3">Recipe</th>
                      <th className="px-3 py-3 text-right">Slots</th>
                      <th className="px-3 py-3">Risk</th>
                      <th className="px-3 py-3">Style-Lint Status</th>
                      <th className="px-4 py-3 text-right">Est.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222B36] text-xs">
                    {filteredComponents.map((item) => {
                      const isDone = migratedComponents.includes(item.id);
                      const isSelected = selectedComponent?.id === item.id;
                      const totalMins =
                        item.baseMinutes + (enforceNoInlineStyle ? item.lintAuditMinutes : 0);

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedComponentId(item.id)}
                          className={`cursor-pointer transition-colors duration-150 ${
                            isSelected ? 'bg-[#161D26]' : 'hover:bg-[#161D26]/50'
                          }`}
                        >
                          <td
                            className="px-3 py-2.5 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              aria-label={`Mark ${item.name} as ${isDone ? 'pending' : 'migrated'}`}
                              onClick={() => onToggleMigrated(item.id)}
                              className="inline-flex items-center justify-center rounded-sm p-1 focus-visible:outline-2 focus-visible:outline-[#10B981]"
                            >
                              {isDone ? (
                                <CheckSquare
                                  className="h-4 w-4 text-[#10B981]"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Square className="h-4 w-4 text-[#526071]" aria-hidden="true" />
                              )}
                            </button>
                          </td>
                          <td className="px-3 py-2.5">
                            <p
                              className={`font-medium ${
                                isDone ? 'text-[#6E7681] line-through' : 'text-[#E6EDF3]'
                              }`}
                            >
                              {item.name}
                            </p>
                            <p className="text-[11px] text-[#6E7681]">{item.category}</p>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[#C9D1D9]">
                            {item.recipeKind}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono tabular-nums text-[#8B949E]">
                            {item.slotCount}
                          </td>
                          <td
                            className={`whitespace-nowrap px-3 py-2.5 font-medium ${getComplexityClass(item.complexity)}`}
                          >
                            {item.complexity}
                          </td>
                          <td
                            className={`whitespace-nowrap px-3 py-2.5 ${getLintStatusClass(item.styleLintStatus)}`}
                          >
                            {item.styleLintStatus}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono tabular-nums text-[#C9D1D9]">
                            {totalMins}m
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {selectedComponent && (
                <ComponentDetailPanel
                  component={selectedComponent}
                  isMigrated={migratedComponents.includes(selectedComponent.id)}
                  enforceNoInlineStyle={enforceNoInlineStyle}
                  onToggleMigrated={onToggleMigrated}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <LiveStyleLinter onNotify={onNotify} />
      )}
    </div>
  );
}
