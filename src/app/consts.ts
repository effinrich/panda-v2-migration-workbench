import { GitCompareArrows, LayoutGrid, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import type { ActiveView } from '../shared/types/migration';

export const STORAGE_KEY = 'panda-v2-migration-workbench-v1';

export interface NavItem {
  id: ActiveView;
  label: string;
  breadcrumb: string;
  icon: typeof SlidersHorizontal;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview & Estimator',
    breadcrumb: 'Overview',
    icon: SlidersHorizontal,
  },
  {
    id: 'blockers',
    label: 'Blockers & Code Diffs',
    breadcrumb: 'Blockers & Diffs',
    icon: ShieldAlert,
  },
  {
    id: 'matrix',
    label: 'Component Audit & Linter',
    breadcrumb: 'Component Matrix',
    icon: LayoutGrid,
  },
  {
    id: 'compare',
    label: 'Park UI vs. Ark UI',
    breadcrumb: 'Architecture Compare',
    icon: GitCompareArrows,
  },
];
