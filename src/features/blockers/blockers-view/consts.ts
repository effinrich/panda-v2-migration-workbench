import type { BlockerCategory, BlockerSeverity } from '../../../shared/types/migration';

export const SEVERITY_FILTER_OPTIONS: Array<'All' | BlockerSeverity> = [
  'All',
  'Critical',
  'High',
  'Moderate',
];

export const CATEGORY_FILTER_OPTIONS: Array<'All' | BlockerCategory> = [
  'All',
  'Engine',
  'Context API',
  'Recipes',
  'Config',
  'Types',
  'CSS Behavior',
  'Style Lint',
];
