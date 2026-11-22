/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { FileDown, Menu, RotateCcw, X } from 'lucide-react';
import type { ActiveView, DecisionWeights, ForkScopeConfig } from '../shared/types/migration';
import { MIGRATION_BLOCKERS } from '../shared/data/blockers';
import { COMPONENT_AUDIT_INVENTORY } from '../shared/data/components';
import { ARCHITECTURE_DIMENSIONS } from '../shared/data/comparison';
import {
  DEFAULT_SCOPE,
  DEFAULT_WEIGHTS,
  calculateComparisonVerdict,
  calculateEffortSummary,
  generateMarkdownBrief,
} from '../shared/utils/calculations';
import { BarMeter } from '../shared/ui/bar-meter/bar-meter';
import { OverviewView } from '../features/overview/overview-view/overview-view';
import { BlockersView } from '../features/blockers/blockers-view/blockers-view';
import { ComponentMatrixView } from '../features/component-matrix/component-matrix-view/component-matrix-view';
import { CompareView } from '../features/architecture-compare/compare-view/compare-view';
import { ExportBriefModal } from '../features/brief-export/export-brief-modal/export-brief-modal';
import { NAV_ITEMS } from './consts';
import { useToastMessage, useWorkbenchState } from './hooks';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [workbench, setWorkbench] = useWorkbenchState();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const { toastMessage, notify } = useToastMessage();

  const effort = useMemo(
    () => calculateEffortSummary(workbench.scope, COMPONENT_AUDIT_INVENTORY),
    [workbench.scope]
  );

  const verdict = useMemo(
    () => calculateComparisonVerdict(ARCHITECTURE_DIMENSIONS, workbench.weights),
    [workbench.weights]
  );

  const markdownBrief = useMemo(
    () =>
      generateMarkdownBrief(
        workbench.scope,
        effort,
        verdict,
        workbench.mitigatedBlockers,
        workbench.migratedComponents,
        COMPONENT_AUDIT_INVENTORY
      ),
    [workbench, effort, verdict]
  );

  const handleUpdateScope = (patch: Partial<ForkScopeConfig>) => {
    setWorkbench((prev) => ({
      ...prev,
      scope: { ...prev.scope, ...patch },
    }));
  };

  const handleUpdateWeights = (patch: Partial<DecisionWeights>) => {
    setWorkbench((prev) => ({
      ...prev,
      weights: { ...prev.weights, ...patch },
    }));
  };

  const handleToggleBlocker = (id: string) => {
    setWorkbench((prev) => {
      const exists = prev.mitigatedBlockers.includes(id);
      return {
        ...prev,
        mitigatedBlockers: exists
          ? prev.mitigatedBlockers.filter((item) => item !== id)
          : [...prev.mitigatedBlockers, id],
      };
    });
  };

  const handleToggleComponent = (id: string) => {
    setWorkbench((prev) => {
      const exists = prev.migratedComponents.includes(id);
      return {
        ...prev,
        migratedComponents: exists
          ? prev.migratedComponents.filter((item) => item !== id)
          : [...prev.migratedComponents, id],
      };
    });
  };

  const handleBulkToggleCategory = (ids: string[], markDone: boolean) => {
    setWorkbench((prev) => {
      const current = new Set(prev.migratedComponents);
      for (const id of ids) {
        if (markDone) current.add(id);
        else current.delete(id);
      }
      return {
        ...prev,
        migratedComponents: Array.from(current),
      };
    });
  };

  const handleResetAll = () => {
    setWorkbench({
      scope: DEFAULT_SCOPE,
      mitigatedBlockers: [],
      migratedComponents: [],
      weights: DEFAULT_WEIGHTS,
    });
    notify('Reset scope configuration, checklists, and decision weights');
  };

  const activeNav = NAV_ITEMS.find((item) => item.id === activeView) ?? NAV_ITEMS[0];

  const blockerPct = Math.round(
    (workbench.mitigatedBlockers.length / MIGRATION_BLOCKERS.length) * 100
  );
  const componentPct = Math.round(
    (workbench.migratedComponents.length / COMPONENT_AUDIT_INVENTORY.length) * 100
  );

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#11161D]">
      <div>
        <div className="flex h-14 items-center justify-between border-b border-[#222B36] px-5">
          <span className="font-display shrink-0 whitespace-nowrap text-sm font-bold tracking-tight text-[#F0F6FC]">
            Panda v2 Workbench
          </span>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
            className="rounded-sm p-1 text-[#8B949E] hover:text-[#E6EDF3] lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Workbench sections" className="space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeView;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveView(item.id);
                  setMobileNavOpen(false);
                }}
                className={`flex w-full items-center gap-3 whitespace-nowrap rounded-md px-3 py-2.5 text-left text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#10B981] ${
                  isActive
                    ? 'bg-[#161D26] text-[#34D399]'
                    : 'text-[#9CA7B5] hover:bg-[#161D26]/60 hover:text-[#E6EDF3]'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#10B981]' : 'text-[#6E7681]'}`}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 border-t border-[#222B36] p-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8B949E]">Blockers Mitigated</span>
              <span className="font-mono tabular-nums text-[#E6EDF3]">
                {workbench.mitigatedBlockers.length}/{MIGRATION_BLOCKERS.length}
              </span>
            </div>
            <div className="mt-1.5">
              <BarMeter
                value={blockerPct}
                tone="emerald"
                label={`Blockers mitigated: ${blockerPct}%`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8B949E]">Components Audited</span>
              <span className="font-mono tabular-nums text-[#E6EDF3]">
                {workbench.migratedComponents.length}/{COMPONENT_AUDIT_INVENTORY.length}
              </span>
            </div>
            <div className="mt-1.5">
              <BarMeter
                value={componentPct}
                tone="emerald"
                label={`Components audited: ${componentPct}%`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#222B36] pt-3 text-[11px] text-[#8B949E]">
          <span>
            Style Lint:{' '}
            <span
              className={workbench.scope.enforceNoInlineStyle ? 'text-[#34D399]' : 'text-[#8B949E]'}
            >
              {workbench.scope.enforceNoInlineStyle ? 'Enforced' : 'Off'}
            </span>
          </span>
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1 whitespace-nowrap text-[#8B949E] transition-colors hover:text-[#E6EDF3] focus-visible:outline-2 focus-visible:outline-[#10B981]"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#090C10] text-[#E6EDF3]">
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-[248px] lg:shrink-0 lg:border-r lg:border-[#222B36]">
        {sidebarContent}
      </aside>

      {mobileNavOpen && (
        <dialog
          open
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-40 m-0 flex h-screen w-screen max-w-none bg-transparent p-0 lg:hidden"
        >
          <button
            type="button"
            aria-label="Dismiss navigation menu"
            className="fixed inset-0 bg-black/70"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 w-[260px] max-w-[80vw] border-r border-[#222B36]">
            {sidebarContent}
          </div>
        </dialog>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-8 border-b border-[#222B36] bg-[#090C10]/95 px-4 backdrop-blur-xs sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-sm p-1.5 text-[#8B949E] hover:bg-[#161D26] hover:text-[#E6EDF3] lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 truncate text-xs text-[#8B949E]"
            >
              <span className="hidden whitespace-nowrap sm:inline">Migration Workbench</span>
              <span aria-hidden="true" className="hidden text-[#303C4B] sm:inline">
                /
              </span>
              <span className="truncate font-medium text-[#F0F6FC]">{activeNav.breadcrumb}</span>
            </nav>
          </div>

          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-[#10B981] px-3.5 py-2 text-xs font-semibold text-[#06130E] transition-colors duration-150 hover:bg-[#34D399] focus-visible:outline-2 focus-visible:outline-[#34D399]"
          >
            <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
            Export Brief
          </button>
        </header>

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {activeView === 'overview' && (
            <OverviewView
              scope={workbench.scope}
              effort={effort}
              mitigatedCount={workbench.mitigatedBlockers.length}
              totalBlockers={MIGRATION_BLOCKERS.length}
              migratedCount={workbench.migratedComponents.length}
              totalComponents={COMPONENT_AUDIT_INVENTORY.length}
              onUpdateScope={handleUpdateScope}
              onNavigate={setActiveView}
            />
          )}

          {activeView === 'blockers' && (
            <BlockersView
              mitigatedBlockers={workbench.mitigatedBlockers}
              onToggleMitigated={handleToggleBlocker}
              onNotify={notify}
            />
          )}

          {activeView === 'matrix' && (
            <ComponentMatrixView
              migratedComponents={workbench.migratedComponents}
              enforceNoInlineStyle={workbench.scope.enforceNoInlineStyle}
              onToggleMigrated={handleToggleComponent}
              onBulkToggleCategory={handleBulkToggleCategory}
              onNotify={notify}
            />
          )}

          {activeView === 'compare' && (
            <CompareView
              dimensions={ARCHITECTURE_DIMENSIONS}
              weights={workbench.weights}
              verdict={verdict}
              onUpdateWeights={handleUpdateWeights}
            />
          )}
        </main>
      </div>

      {exportOpen && (
        <ExportBriefModal
          markdown={markdownBrief}
          onClose={() => setExportOpen(false)}
          onNotify={notify}
        />
      )}

      {toastMessage && (
        <output
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 border border-[#10B981]/40 bg-[#11161D] px-4 py-2.5 text-xs font-medium text-[#E6EDF3]"
        >
          {toastMessage}
        </output>
      )}
    </div>
  );
}
