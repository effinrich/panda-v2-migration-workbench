import { ArrowRight } from 'lucide-react';
import { ActiveView, EffortSummary, ForkScopeConfig } from '../../../shared/types/migration';
import { PANDA_V2_BENCHMARKS } from '../../../shared/data/comparison';
import { BarMeter } from '../../../shared/ui/bar-meter/bar-meter';
import { ScopeToggleRow } from './partials/scope-toggle-row';

export interface OverviewViewProps {
  scope: ForkScopeConfig;
  effort: EffortSummary;
  mitigatedCount: number;
  totalBlockers: number;
  migratedCount: number;
  totalComponents: number;
  onUpdateScope: (patch: Partial<ForkScopeConfig>) => void;
  onNavigate: (view: ActiveView) => void;
}

export function OverviewView({
  scope,
  effort,
  mitigatedCount,
  totalBlockers,
  migratedCount,
  totalComponents,
  onUpdateScope,
  onNavigate,
}: OverviewViewProps) {
  const difficultyTone =
    effort.difficultyLabel === 'Low-Moderate'
      ? 'text-[#34D399]'
      : effort.difficultyLabel === 'Moderate'
        ? 'text-[#F59E0B]'
        : 'text-[#F87171]';

  const maxWorkstreamHours = Math.max(1, ...effort.workstreams.map((w) => w.hours));

  return (
    <div className="space-y-8">
      <section className="border-b border-[#222B36] pb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-[#8B949E]">
              Open-Code Park UI CLI Baseline · React {scope.componentCount} Components · Panda CSS
              v2 (Rust/Oxc)
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[#F0F6FC] sm:text-3xl">
              Branching Park UI to Panda v2 is{' '}
              <span className={difficultyTone}>{effort.difficultyLabel}</span> — a bounded migration
              sprint, not a rewrite
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9CA7B5]">
              {effort.riskSummary} Because Open-Code Park UI places local recipes directly in your
              repository without the legacy preset black box, roughly{' '}
              <span className="font-mono tabular-nums text-[#E6EDF3]">
                {effort.automatablePct}%
              </span>{' '}
              of upgrades resolve via mechanical AST codemods, leaving manual effort focused on{' '}
              <code className="text-xs text-[#6EE7B7]">defineParts</code> removal, zero-inline-style
              wrapper guards, and visual QA.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('blockers')}
              className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md border border-[#222B36] bg-[#11161D] px-4 py-2.5 text-xs font-medium text-[#E6EDF3] transition-colors duration-150 hover:border-[#344253] hover:bg-[#161D26] focus-visible:outline-2 focus-visible:outline-[#10B981]"
            >
              Inspect 7 Blockers
              <ArrowRight className="h-3.5 w-3.5 text-[#10B981]" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('compare')}
              className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-[#10B981] px-4 py-2.5 text-xs font-semibold text-[#06130E] transition-colors duration-150 hover:bg-[#34D399] focus-visible:outline-2 focus-visible:outline-[#34D399]"
            >
              Compare vs. Ark UI
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 divide-y divide-[#222B36] border border-[#222B36] bg-[#11161D] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          <div className="p-5">
            <p className="text-xs text-[#8B949E]">Estimated Migration Effort</p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[#F0F6FC]">
              {effort.totalHours}h
            </p>
            <p className="mt-1 text-xs text-[#8B949E]">
              <span className="font-mono tabular-nums text-[#34D399]">
                ~{effort.calendarDays} days
              </span>{' '}
              with {scope.teamSize} eng
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs text-[#8B949E]">Codemod-Automatable Share</p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[#34D399]">
              {effort.automatablePct}%
            </p>
            <p className="mt-1 text-xs text-[#8B949E]">
              <span className="font-mono tabular-nums text-[#E6EDF3]">
                {100 - effort.automatablePct}%
              </span>{' '}
              manual recipe &amp; QA pass
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs text-[#8B949E]">Saved vs. Greenfield Ark UI</p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[#F0F6FC]">
              ~{effort.hoursSavedByFork}h
            </p>
            <p className="mt-1 text-xs text-[#8B949E]">
              Greenfield est.{' '}
              <span className="font-mono tabular-nums text-[#E6EDF3]">
                {effort.greenfieldArkHours}h
              </span>{' '}
              for {scope.componentCount} cmp
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs text-[#8B949E]">Audit Progress</p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[#F0F6FC]">
              {mitigatedCount}/{totalBlockers}{' '}
              <span className="text-sm font-normal text-[#8B949E]">blockers</span>
            </p>
            <p className="mt-1 text-xs text-[#8B949E]">
              <span className="font-mono tabular-nums text-[#E6EDF3]">
                {migratedCount}/{totalComponents}
              </span>{' '}
              components verified
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        <section className="border border-[#222B36] bg-[#11161D] xl:col-span-5">
          <div className="border-b border-[#222B36] px-5 py-4">
            <h2 className="text-base font-semibold text-[#F0F6FC]">
              Fork Scope &amp; Policy Configurator
            </h2>
            <p className="mt-1 text-xs text-[#8B949E]">
              Tune your repository profile to recalculate hours, schedule, and risk profile.
            </p>
          </div>

          <div className="space-y-5 border-b border-[#222B36] px-5 py-5">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="component-count-slider"
                  className="text-sm font-medium text-[#E6EDF3]"
                >
                  Component Library Scale
                </label>
                <span className="font-mono text-sm font-semibold tabular-nums text-[#34D399]">
                  {scope.componentCount} React components
                </span>
              </div>
              <input
                id="component-count-slider"
                type="range"
                min={30}
                max={50}
                step={1}
                value={scope.componentCount}
                onChange={(e) => onUpdateScope({ componentCount: Number(e.target.value) })}
                className="obsidian-range mt-3 w-full"
              />
              <div className="mt-1.5 flex justify-between font-mono text-[11px] tabular-nums text-[#6E7681]">
                <span>30 core</span>
                <span>42 standard</span>
                <span>50 full suite</span>
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-[#E6EDF3]">
                Migration Engineers Assigned
              </span>
              <fieldset
                aria-label="Migration Engineers Assigned"
                className="mt-2.5 grid grid-cols-3 gap-1 rounded-md border border-[#222B36] bg-[#090C10] p-1"
              >
                {([1, 2, 3] as const).map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => onUpdateScope({ teamSize: count })}
                    className={`whitespace-nowrap rounded-sm py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#10B981] ${
                      scope.teamSize === count
                        ? 'bg-[#161D26] text-[#34D399]'
                        : 'text-[#8B949E] hover:text-[#E6EDF3]'
                    }`}
                  >
                    {count} Engineer{count > 1 ? 's' : ''}
                  </button>
                ))}
              </fieldset>
            </div>
          </div>

          <div className="divide-y divide-[#222B36]">
            <ScopeToggleRow
              id="toggle-no-inline-style"
              label="Strict Zero-Inline-Style Lint Gate"
              description="Ban style={...} via Oxlint/ESLint + Omit<..., 'style'>; data-* attrs, recipe props, or JSX wrappers only."
              checked={scope.enforceNoInlineStyle}
              impactLabel={scope.enforceNoInlineStyle ? 'Enforced' : 'Off'}
              onToggle={() =>
                onUpdateScope({
                  enforceNoInlineStyle: !scope.enforceNoInlineStyle,
                })
              }
            />
            <ScopeToggleRow
              id="toggle-node-22"
              label="Node 22+ & Native ESM Already Active"
              description="Uncheck if CI, Docker images, or panda.config still run Node 18/20 or CommonJS."
              checked={scope.node22Ready}
              impactLabel={scope.node22Ready ? 'Ready' : '+5.5h'}
              onToggle={() => onUpdateScope({ node22Ready: !scope.node22Ready })}
            />
            <ScopeToggleRow
              id="toggle-custom-context"
              label="Local lib/create-style-context.tsx Wrapper"
              description="Fork owns a custom Park UI context helper needing reconciliation with createSlotRecipeContext."
              checked={scope.usesCustomStyleContext}
              impactLabel={scope.usesCustomStyleContext ? '+3.5h' : '0h'}
              onToggle={() =>
                onUpdateScope({
                  usesCustomStyleContext: !scope.usesCustomStyleContext,
                })
              }
            />
            <ScopeToggleRow
              id="toggle-define-parts"
              label="Recipes Use Legacy defineParts(anatomy)"
              description="Requires rewriting anatomy part helpers to explicit defineSlotRecipe slot keys."
              checked={scope.usesDefineParts}
              impactLabel={scope.usesDefineParts ? '+4.5h' : '0h'}
              onToggle={() => onUpdateScope({ usesDefineParts: !scope.usesDefineParts })}
            />
            <ScopeToggleRow
              id="toggle-monorepo"
              label="Multi-Package Monorepo Lockstep"
              description="Coordinate @pandacss/* v2 upgrades across UI package, Storybook, and consuming apps."
              checked={scope.multiPackageMonorepo}
              impactLabel={scope.multiPackageMonorepo ? '+4.5h' : '0h'}
              onToggle={() =>
                onUpdateScope({
                  multiPackageMonorepo: !scope.multiPackageMonorepo,
                })
              }
            />
            <ScopeToggleRow
              id="toggle-visual-qa"
              label="Full Interactive Visual Regression Pass"
              description="Screenshot diff hover, focus, icon, and open states for v2 selector precedence fixes."
              checked={scope.visualRegressionSuite}
              impactLabel={scope.visualRegressionSuite ? 'Full QA' : 'Spot check'}
              onToggle={() =>
                onUpdateScope({
                  visualRegressionSuite: !scope.visualRegressionSuite,
                })
              }
            />
          </div>
        </section>

        <div className="space-y-6 xl:col-span-7">
          <section className="border border-[#222B36] bg-[#11161D]">
            <div className="flex items-center justify-between border-b border-[#222B36] px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-[#F0F6FC]">
                  Phase-by-Phase Workstream Breakdown
                </h2>
                <p className="mt-0.5 text-xs text-[#8B949E]">
                  Ordered sequence to upgrade an Open-Code Park UI fork cleanly onto Panda v2.
                </p>
              </div>
              <span className="whitespace-nowrap font-mono text-xs tabular-nums text-[#8B949E]">
                Total {effort.totalHours}h
              </span>
            </div>

            <div className="divide-y divide-[#222B36]">
              {effort.workstreams.map((ws, idx) => (
                <div key={ws.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-xs tabular-nums text-[#6E7681]">
                        0{idx + 1}.
                      </span>
                      <h3 className="text-sm font-medium text-[#E6EDF3]">{ws.label}</h3>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                      <span className="text-[#8B949E]">{ws.automatablePct}% auto</span>
                      <span aria-hidden="true" className="text-[#303C4B]">
                        ·
                      </span>
                      <span className="font-semibold text-[#34D399]">{ws.hours}h</span>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <BarMeter
                      value={ws.hours}
                      max={maxWorkstreamHours}
                      tone={ws.id === 'style-lint' ? 'amber' : 'emerald'}
                      label={`${ws.label}: ${ws.hours} hours`}
                    />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#8B949E]">{ws.notes}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-[#222B36] bg-[#11161D]">
            <div className="border-b border-[#222B36] px-5 py-4">
              <h2 className="text-base font-semibold text-[#F0F6FC]">
                Why Upgrade: Panda CSS v2 Rust &amp; Oxc Engine Gains
              </h2>
              <p className="mt-0.5 text-xs text-[#8B949E]">
                Published compiler improvements replacing Node.js ts-morph with native
                @pandacss/compiler.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#222B36] bg-[#161D26] text-xs font-medium text-[#8B949E]">
                    <th className="px-5 py-3">Pipeline Stage</th>
                    <th className="px-4 py-3">v1 Engine</th>
                    <th className="px-4 py-3">v2 Rust/Oxc Engine</th>
                    <th className="px-5 py-3 text-right">Measured Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222B36] text-xs">
                  {PANDA_V2_BENCHMARKS.map((row) => (
                    <tr
                      key={row.metric}
                      className="transition-colors duration-150 hover:bg-[#161D26]/60"
                    >
                      <td className="px-5 py-3.5 align-top">
                        <p className="font-medium text-[#E6EDF3]">{row.metric}</p>
                        <p className="mt-0.5 text-[11px] text-[#8B949E]">{row.impactNote}</p>
                      </td>
                      <td className="px-4 py-3.5 align-top text-[#8B949E]">{row.v1Engine}</td>
                      <td className="px-4 py-3.5 align-top text-[#C9D1D9]">{row.v2Engine}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right align-top font-mono font-semibold tabular-nums text-[#34D399]">
                        {row.delta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
