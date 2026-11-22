import type { ComparisonDimension, DecisionWeights } from '../../../shared/types/migration';
import type { ComparisonVerdict } from '../../../shared/utils/calculations';
import { BarMeter } from '../../../shared/ui/bar-meter/bar-meter';
import { PRIORITY_SLIDERS } from './consts';

export interface CompareViewProps {
  dimensions: ComparisonDimension[];
  weights: DecisionWeights;
  verdict: ComparisonVerdict;
  onUpdateWeights: (patch: Partial<DecisionWeights>) => void;
}

export function CompareView({ dimensions, weights, verdict, onUpdateWeights }: CompareViewProps) {
  const applyScenario = (scenario: 'fast' | 'bespoke' | 'balanced') => {
    if (scenario === 'fast') {
      onUpdateWeights({
        speedToMarket: 95,
        bespokeBrandGrammar: 35,
        upstreamIndependence: 35,
        minimalMaintenanceLoad: 60,
      });
    } else if (scenario === 'bespoke') {
      onUpdateWeights({
        speedToMarket: 30,
        bespokeBrandGrammar: 95,
        upstreamIndependence: 85,
        minimalMaintenanceLoad: 80,
      });
    } else {
      onUpdateWeights({
        speedToMarket: 70,
        bespokeBrandGrammar: 70,
        upstreamIndependence: 60,
        minimalMaintenanceLoad: 70,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 border-b border-[#222B36] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs text-[#8B949E]">
            Head-to-Head Architectural Decision Matrix · 9 Engineering Dimensions
          </p>
          <h1 className="mt-1.5 text-2xl font-bold text-[#F0F6FC]">
            Branch Open-Code Park UI (Panda v2) vs. Greenfield Ark UI + Panda v2
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-[#8B949E]">
            Both stacks run on the exact same Ark UI (Zag.js) state machines and Panda CSS v2
            Rust/Oxc compiler. The real trade-off is initial delivery speed versus day-one
            architectural cleanliness.
          </p>
        </div>

        <fieldset
          aria-label="Decision weight presets"
          className="inline-flex flex-wrap items-center gap-1 self-start rounded-md border border-[#222B36] bg-[#11161D] p-1 lg:self-auto"
        >
          <button
            type="button"
            onClick={() => applyScenario('fast')}
            className="shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1.5 text-xs font-medium text-[#C9D1D9] transition-colors hover:bg-[#161D26] hover:text-[#34D399]"
          >
            Ship Fast
          </button>
          <button
            type="button"
            onClick={() => applyScenario('balanced')}
            className="shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1.5 text-xs font-medium text-[#C9D1D9] transition-colors hover:bg-[#161D26] hover:text-[#34D399]"
          >
            Balanced
          </button>
          <button
            type="button"
            onClick={() => applyScenario('bespoke')}
            className="shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1.5 text-xs font-medium text-[#C9D1D9] transition-colors hover:bg-[#161D26] hover:text-[#34D399]"
          >
            Bespoke Brand
          </button>
        </fieldset>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <section className="border border-[#222B36] bg-[#11161D] xl:col-span-7">
          <div className="border-b border-[#222B36] px-5 py-4">
            <h2 className="text-base font-semibold text-[#F0F6FC]">
              Team Priority Weighting Simulator
            </h2>
            <p className="mt-0.5 text-xs text-[#8B949E]">
              Adjust engineering priorities to see how the architectural fit shifts between forking
              Park UI and authoring greenfield on Ark UI.
            </p>
          </div>
          <div className="grid grid-cols-1 divide-y divide-[#222B36] sm:grid-cols-2 sm:divide-y-0">
            {PRIORITY_SLIDERS.map((slider, idx) => (
              <div
                key={slider.key}
                className={`px-5 py-4 ${idx >= 2 ? 'sm:border-t sm:border-[#222B36]' : ''} ${
                  idx % 2 === 1 ? 'sm:border-l sm:border-[#222B36]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`weight-${slider.key}`}
                    className="text-xs font-medium text-[#E6EDF3]"
                  >
                    {slider.label}
                  </label>
                  <span className="font-mono text-xs font-semibold tabular-nums text-[#34D399]">
                    {weights[slider.key]}%
                  </span>
                </div>
                <input
                  id={`weight-${slider.key}`}
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={weights[slider.key]}
                  onChange={(e) => onUpdateWeights({ [slider.key]: Number(e.target.value) })}
                  className="obsidian-range mt-3 w-full"
                />
                <p className="mt-2 text-[11px] leading-relaxed text-[#8B949E]">{slider.helper}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col justify-between border border-[#222B36] bg-[#11161D] p-6 xl:col-span-5">
          <div>
            <p className="text-xs text-[#8B949E]">
              Weighted Recommendation · Current Team Priorities
            </p>
            <h2 className="mt-2 text-lg font-bold text-[#F0F6FC]">{verdict.headline}</h2>
            <p className="mt-2.5 text-xs leading-relaxed text-[#9CA7B5]">{verdict.rationale}</p>
          </div>

          <div className="mt-6 space-y-4 border-t border-[#222B36] pt-5">
            <div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-medium text-[#E6EDF3]">
                  Branch Open-Code Park UI → Panda v2
                </span>
                <span
                  className={`font-mono font-semibold tabular-nums ${
                    verdict.parkWeightedScore >= verdict.arkWeightedScore
                      ? 'text-[#34D399]'
                      : 'text-[#8B949E]'
                  }`}
                >
                  {verdict.parkWeightedScore} / 100
                </span>
              </div>
              <div className="mt-2">
                <BarMeter
                  value={verdict.parkWeightedScore}
                  tone={verdict.parkWeightedScore >= verdict.arkWeightedScore ? 'emerald' : 'slate'}
                  label={`Branch Park UI weighted fit: ${verdict.parkWeightedScore} out of 100`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-medium text-[#E6EDF3]">
                  Greenfield Ark UI + Panda v2 Library
                </span>
                <span
                  className={`font-mono font-semibold tabular-nums ${
                    verdict.arkWeightedScore > verdict.parkWeightedScore
                      ? 'text-[#34D399]'
                      : 'text-[#8B949E]'
                  }`}
                >
                  {verdict.arkWeightedScore} / 100
                </span>
              </div>
              <div className="mt-2">
                <BarMeter
                  value={verdict.arkWeightedScore}
                  tone={verdict.arkWeightedScore > verdict.parkWeightedScore ? 'emerald' : 'slate'}
                  label={`Greenfield Ark UI weighted fit: ${verdict.arkWeightedScore} out of 100`}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="border border-[#222B36] bg-[#11161D]">
        <div className="border-b border-[#222B36] px-5 py-4">
          <h2 className="text-base font-semibold text-[#F0F6FC]">
            9-Dimension Engineering Comparison
          </h2>
          <p className="mt-0.5 text-xs text-[#8B949E]">
            Concrete architectural differences, migration costs, and zero-inline-style policy
            trade-offs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#222B36] bg-[#161D26] text-xs font-medium text-[#8B949E]">
                <th className="w-52 px-5 py-3.5">Dimension</th>
                <th className="px-4 py-3.5">Branch Open-Code Park UI (Panda v2)</th>
                <th className="px-4 py-3.5">Greenfield Ark UI + Panda v2</th>
                <th className="whitespace-nowrap px-5 py-3.5 text-right">Edge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222B36] text-xs">
              {dimensions.map((dim) => {
                const edge =
                  Math.abs(dim.parkScore - dim.arkScore) <= 4
                    ? 'Tie'
                    : dim.parkScore > dim.arkScore
                      ? 'Park UI Fork'
                      : 'Ark Greenfield';

                return (
                  <tr key={dim.id} className="transition-colors duration-150 hover:bg-[#161D26]/50">
                    <td className="px-5 py-4 align-top">
                      <p className="font-semibold text-[#E6EDF3]">{dim.dimension}</p>
                      <p className="mt-1 text-[11px] text-[#6E7681]">
                        {dim.category} · Weight {weights[dim.weightKey]}%
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top leading-relaxed text-[#C9D1D9]">
                      <p>{dim.parkForkSummary}</p>
                      <p className="mt-2 font-mono text-[11px] tabular-nums text-[#8B949E]">
                        Fit score: {dim.parkScore}/100
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top leading-relaxed text-[#C9D1D9]">
                      <p>{dim.arkGreenfieldSummary}</p>
                      <p className="mt-2 font-mono text-[11px] tabular-nums text-[#8B949E]">
                        Fit score: {dim.arkScore}/100
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right align-top">
                      <span
                        className={`font-medium ${
                          edge === 'Tie'
                            ? 'text-[#8B949E]'
                            : edge === 'Park UI Fork'
                              ? 'text-[#34D399]'
                              : 'text-[#93C5FD]'
                        }`}
                      >
                        {edge}
                      </span>
                      <p className="ml-auto mt-1 max-w-[200px] whitespace-normal text-right text-[11px] leading-snug text-[#8B949E]">
                        {dim.verdictNote}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
