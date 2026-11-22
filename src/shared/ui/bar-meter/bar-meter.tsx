export interface BarMeterProps {
  value: number;
  max?: number;
  tone?: 'emerald' | 'amber' | 'crimson' | 'slate';
  label: string;
}

export function BarMeter({ value, max = 100, tone = 'emerald', label }: BarMeterProps) {
  const clamped = Math.round(Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100)));

  return (
    <progress
      value={clamped}
      max={100}
      data-tone={tone}
      aria-label={label}
      className="obsidian-progress"
    />
  );
}
