import type { ComplexityTier, StyleLintStatus } from '../../../shared/types/migration';

export function getComplexityClass(tier: ComplexityTier): string {
  switch (tier) {
    case 'High':
      return 'text-[#F87171]';
    case 'Medium':
      return 'text-[#F59E0B]';
    case 'Low':
      return 'text-[#34D399]';
  }
}

export function getLintStatusClass(status: StyleLintStatus): string {
  switch (status) {
    case 'Compliant':
      return 'text-[#34D399]';
    case 'Needs Wrapper Guard':
      return 'text-[#93C5FD]';
    case 'Audit Dynamic Vars':
      return 'text-[#F59E0B]';
  }
}
