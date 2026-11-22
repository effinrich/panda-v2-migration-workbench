import type {
  ComplexityTier,
  ComponentCategory,
  StyleLintStatus,
} from '../../../shared/types/migration';

export const CATEGORIES: Array<'All' | ComponentCategory> = [
  'All',
  'Primitive',
  'Form',
  'Overlay',
  'Navigation',
  'Data Display',
];

export const LINT_STATUSES: Array<'All' | StyleLintStatus> = [
  'All',
  'Compliant',
  'Needs Wrapper Guard',
  'Audit Dynamic Vars',
];

export const COMPLEXITY_FILTERS: Array<'All' | ComplexityTier> = ['All', 'High', 'Medium', 'Low'];
