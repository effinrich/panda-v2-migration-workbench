import type { BlockerSeverity } from '../../../shared/types/migration';

export function getSeverityTextClass(severity: BlockerSeverity): string {
  switch (severity) {
    case 'Critical':
      return 'text-[#F87171]';
    case 'High':
      return 'text-[#F59E0B]';
    case 'Moderate':
      return 'text-[#93C5FD]';
  }
}
