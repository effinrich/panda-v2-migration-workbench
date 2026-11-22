import type { DecisionWeights } from '../../../shared/types/migration';

export interface PrioritySliderConfig {
  key: keyof DecisionWeights;
  label: string;
  helper: string;
}

export const PRIORITY_SLIDERS: PrioritySliderConfig[] = [
  {
    key: 'speedToMarket',
    label: 'Time to 40 Production Components',
    helper: 'Higher weight favors shipping full accessible component coverage immediately.',
  },
  {
    key: 'bespokeBrandGrammar',
    label: 'Bespoke Visual & Token Grammar',
    helper:
      'Higher weight favors authoring custom token scales instead of inheriting Radix/Park conventions.',
  },
  {
    key: 'upstreamIndependence',
    label: 'Zero Legacy Layer & Clean v2 Baseline',
    helper: 'Higher weight favors direct Ark UI + Panda v2 authoring with zero migration residue.',
  },
  {
    key: 'minimalMaintenanceLoad',
    label: 'Long-Term Maintenance & Lint Hygiene',
    helper:
      'Higher weight favors minimal wrapper surface and day-one Omit<..., "style"> enforcement.',
  },
];
