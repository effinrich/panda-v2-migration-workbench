import type { ComponentAuditItem } from '../../../../shared/types/migration';
import { getComplexityClass, getLintStatusClass } from '../utils';

export interface ComponentDetailPanelProps {
  component: ComponentAuditItem;
  isMigrated: boolean;
  enforceNoInlineStyle: boolean;
  onToggleMigrated: (id: string) => void;
}

export function ComponentDetailPanel({
  component,
  isMigrated,
  enforceNoInlineStyle,
  onToggleMigrated,
}: ComponentDetailPanelProps) {
  return (
    <aside className="border border-[#222B36] bg-[#11161D] xl:sticky xl:top-6 xl:col-span-4">
      <div className="border-b border-[#222B36] px-5 py-4">
        <div className="flex items-center justify-between gap-2 text-xs text-[#8B949E]">
          <span>
            {component.category} · <code className="text-[#6EE7B7]">{component.recipeKind}</code> ·{' '}
            {component.slotCount} slot
            {component.slotCount > 1 ? 's' : ''}
          </span>
          <span className={`font-medium ${getComplexityClass(component.complexity)}`}>
            {component.complexity} Risk
          </span>
        </div>
        <h2 className="mt-1.5 text-lg font-semibold text-[#F0F6FC]">{component.name}</h2>
        <p className="mt-0.5 font-mono text-xs text-[#8B949E]">{component.arkPrimitive}</p>
      </div>

      <div className="divide-y divide-[#222B36] text-xs">
        <div className="px-5 py-4">
          <p className="font-semibold text-[#E6EDF3]">
            Permitted Styling Surface (No Inline Style)
          </p>
          <p className="mt-1.5 leading-relaxed text-[#9CA7B5]">{component.allowedStylingSurface}</p>
          <p className="mt-2 text-[#8B949E]">
            Lint Audit Status:{' '}
            <span className={`font-medium ${getLintStatusClass(component.styleLintStatus)}`}>
              {component.styleLintStatus}
            </span>
          </p>
        </div>

        {component.dynamicCssVars.length > 0 && (
          <div className="px-5 py-4">
            <p className="font-semibold text-[#F59E0B]">
              Zag.js Dynamic CSS Variables to Keep Encapsulated
            </p>
            <p className="mt-1 leading-relaxed text-[#8B949E]">
              Consume these tokens inside static Panda recipe rules only—never pass JSX{' '}
              <code className="text-[#E6EDF3]">{'style={{ ... }}'}</code> props.
            </p>
            <p className="mt-2 font-mono text-[#E6EDF3]">
              {component.dynamicCssVars.join('  ·  ')}
            </p>
          </div>
        )}

        <div className="px-5 py-4">
          <p className="font-semibold text-[#E6EDF3]">Panda v2 Migration Notes</p>
          <ul className="mt-2 space-y-2 text-[#9CA7B5]">
            {component.pandaV2Gotchas.map((note, idx) => (
              <li key={note} className="flex items-start gap-2.5 leading-relaxed">
                <span className="shrink-0 font-mono tabular-nums text-[#34D399]">0{idx + 1}.</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="font-mono tabular-nums text-[#8B949E]">
            Base {component.baseMinutes}m
            {enforceNoInlineStyle ? ` + Lint ${component.lintAuditMinutes}m` : ''}
          </div>
          <button
            type="button"
            onClick={() => onToggleMigrated(component.id)}
            className={`shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              isMigrated
                ? 'border-[#10B981]/50 bg-[#10B981]/15 text-[#34D399]'
                : 'border-[#222B36] bg-[#090C10] text-[#E6EDF3] hover:border-[#344253]'
            }`}
          >
            {isMigrated ? 'Verified Migrated' : 'Mark Verified'}
          </button>
        </div>
      </div>
    </aside>
  );
}
