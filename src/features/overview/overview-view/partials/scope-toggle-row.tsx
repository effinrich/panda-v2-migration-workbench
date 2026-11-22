import { CheckSquare, Square } from 'lucide-react';

export interface ScopeToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  impactLabel: string;
  onToggle: () => void;
}

export function ScopeToggleRow({
  id,
  label,
  description,
  checked,
  impactLabel,
  onToggle,
}: ScopeToggleRowProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full items-start justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-[#161D26]/70 focus-visible:outline-2 focus-visible:outline-[#10B981]"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 shrink-0 text-[#10B981]">
          {checked ? (
            <CheckSquare className="h-4 w-4 text-[#10B981]" aria-hidden="true" />
          ) : (
            <Square className="h-4 w-4 text-[#526071]" aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#E6EDF3]">{label}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[#8B949E]">{description}</p>
        </div>
      </div>
      <span
        className={`shrink-0 whitespace-nowrap font-mono text-xs tabular-nums ${
          checked ? 'text-[#34D399]' : 'text-[#8B949E]'
        }`}
      >
        {impactLabel}
      </span>
    </button>
  );
}
