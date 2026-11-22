import { ComparisonDimension } from '../types/migration';

export interface EngineBenchmark {
  metric: string;
  v1Engine: string;
  v2Engine: string;
  delta: string;
  impactNote: string;
}

export const PANDA_V2_BENCHMARKS: EngineBenchmark[] = [
  {
    metric: 'Static CSS Extraction',
    v1Engine: 'Node.js ts-morph + ts-evaluator',
    v2Engine: 'Rust Oxc single-pass AST (@pandacss/compiler)',
    delta: '15-37x faster',
    impactNote: 'Parses each TSX file once and skips non-Panda modules entirely.',
  },
  {
    metric: 'Watch-Mode Re-Parse',
    v1Engine: 'Incremental Node AST walk',
    v2Engine: 'Native NAPI Rust delta parse',
    delta: '~360x faster',
    impactNote: 'Near-instant recipe edits across 40+ component Storybook workspaces.',
  },
  {
    metric: 'staticCss Generation',
    v1Engine: 'JS token matrix evaluation',
    v2Engine: 'Native Rust CSS emission',
    delta: 'Up to 85x faster',
    impactNote: 'Eliminates CI bottlenecks when pre-generating design system variants.',
  },
  {
    metric: 'TypeScript Type Graph',
    v1Engine: 'Deep generic instantiation + TS plugin',
    v2Engine: 'Flattened styled-system/types exports',
    delta: '~99% fewer instantiations',
    impactNote: 'Removes IDE lag and obsoletes @pandacss/typescript-plugin.',
  },
];

export const ARCHITECTURE_DIMENSIONS: ComparisonDimension[] = [
  {
    id: 'time-to-40',
    dimension: 'Time to 40 Production Components',
    category: 'Delivery Velocity',
    parkForkSummary:
      '1 to 2 weeks total (3.5-6.5 eng days for Panda v2 migration + lint gate, plus token branding).',
    arkGreenfieldSummary:
      '6 to 12 weeks to design, author, animate, and QA 40+ accessible slot recipes from zero.',
    parkScore: 92,
    arkScore: 34,
    weightKey: 'speedToMarket',
    verdictNote:
      'Forking open-code Park UI delivers an immediate 4-8x calendar advantage for a 30-50 component surface.',
  },
  {
    id: 'v2-idiomatic-cleanliness',
    dimension: 'Panda v2 Idiomatic Architecture',
    category: 'Code Quality',
    parkForkSummary:
      'Requires migrating config namespaces, splitting createStyleContext, and stripping any defineParts remnants.',
    arkGreenfieldSummary:
      'Born native on Panda v2: createSlotRecipeContext, theme.mixins, theme.variants, zero legacy baggage.',
    parkScore: 68,
    arkScore: 96,
    weightKey: 'upstreamIndependence',
    verdictNote:
      'Greenfield starts completely clean; Park fork reaches ~90% parity after one focused migration sprint.',
  },
  {
    id: 'zero-inline-style-enforcement',
    dimension: 'Zero-Inline-Style Lint & Wrapper Discipline',
    category: 'Styling Policy',
    parkForkSummary:
      'Must add Omit<..., "style"> guards across 42 copied wrappers and audit 9 Zag dynamic-var components.',
    arkGreenfieldSummary:
      'Enforce Omit<..., "style"> in a single custom styled/context factory from day 1 before any component exists.',
    parkScore: 76,
    arkScore: 94,
    weightKey: 'minimalMaintenanceLoad',
    verdictNote:
      'Both enforce the exact same ESLint rule in CI; greenfield avoids retrofitting wrapper types across 42 files.',
  },
  {
    id: 'token-brand-flexibility',
    dimension: 'Bespoke Brand & Token Grammar',
    category: 'Design System Fit',
    parkForkSummary:
      'Inherits Park UI semantic token grammar (accent.*, bg.canvas, fg.muted, l1-l3 radii) modeled after Radix scales.',
    arkGreenfieldSummary:
      '100% custom semantic token taxonomy, motion grammar, and slot anatomy aligned to your Figma system.',
    parkScore: 62,
    arkScore: 95,
    weightKey: 'bespokeBrandGrammar',
    verdictNote:
      'If your brand fights Radix-style 12-step color ramps, rewriting Park recipes can erode its initial head start.',
  },
  {
    id: 'css-engine-runtime',
    dimension: 'Runtime Footprint & Oxc Build Performance',
    category: 'Performance',
    parkForkSummary:
      'Zero-runtime atomic CSS + Ark UI Zag.js state machines + full Panda v2 Rust/Oxc build speed.',
    arkGreenfieldSummary:
      'Identical runtime engine (zero-runtime atomic CSS + Ark UI Zag.js) and identical Oxc compiler performance.',
    parkScore: 90,
    arkScore: 92,
    weightKey: 'minimalMaintenanceLoad',
    verdictNote:
      'Post-migration, both architectures compile to the same zero-runtime CSS and headless Zag.js layer.',
  },
  {
    id: 'a11y-zag-parity',
    dimension: 'Accessibility, Keyboard & ARIA Parity',
    category: 'Accessibility',
    parkForkSummary:
      'Backed directly by @ark-ui/react state machines with pre-wired focus rings, disabled states, and ARIA styles.',
    arkGreenfieldSummary:
      'Backed by the same @ark-ui/react machines, but you must manually style every data-focus, data-disabled, and data-highlighted state.',
    parkScore: 90,
    arkScore: 72,
    weightKey: 'speedToMarket',
    verdictNote:
      'Ark UI handles behavior in both, but Park UI already encodes hundreds of subtle visual a11y states in recipes.',
  },
  {
    id: 'upstream-maintenance',
    dimension: 'Upstream Sync & Upgrade Ergonomics',
    category: 'Maintenance',
    parkForkSummary:
      'Open-code fork diverges from Park UI CLI updates; you manually port future Park UI recipe additions.',
    arkGreenfieldSummary:
      'Tracks @ark-ui/react and @pandacss/* directly with zero intermediate design-system layer to reconcile.',
    parkScore: 66,
    arkScore: 90,
    weightKey: 'upstreamIndependence',
    verdictNote:
      'Because Open-Code Park UI is already copy-into-repo by design, you own the code regardless—the real cost is initial divergence.',
  },
  {
    id: 'typescript-dx',
    dimension: 'TypeScript & Wrapper Ergonomics',
    category: 'Developer Experience',
    parkForkSummary:
      'Benefits fully from Panda v2 ~99% TS instantiation drop once ComponentProps and createSlotRecipeContext are updated.',
    arkGreenfieldSummary:
      'Minimal wrapper indirection and strict v2 ComponentProps + SlotRecipeDefinition types from commit one.',
    parkScore: 82,
    arkScore: 92,
    weightKey: 'minimalMaintenanceLoad',
    verdictNote: 'Once migrated, IDE responsiveness and autocomplete latency are effectively tied.',
  },
  {
    id: 'visual-qa-surface',
    dimension: 'Initial Visual Regression QA Burden',
    category: 'Quality Assurance',
    parkForkSummary:
      'Must audit 16 interactive components for v2 nested condition (_hover -> _icon) and recipe base precedence shifts.',
    arkGreenfieldSummary:
      'No v1-to-v2 regression diffing; every component is authored and verified directly against Panda v2 cascade rules.',
    parkScore: 64,
    arkScore: 88,
    weightKey: 'bespokeBrandGrammar',
    verdictNote:
      'Visual QA on a Park fork is bounded (1-2 days); greenfield replaces regression QA with initial design-to-code QA.',
  },
];

export const ESLINT_NO_INLINE_STYLE_CONFIG = `// eslint.config.mjs — Design System Zero-Inline-Style Gate
import reactPlugin from 'eslint-plugin-react'
import pandaPlugin from '@pandacss/eslint-plugin'

export default [
  {
    files: ['packages/ui/src/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      '@pandacss': pandaPlugin,
    },
    rules: {
      // 1. Forbid inline style attribute on all DOM elements
      'react/forbid-dom-props': [
        'error',
        {
          forbid: [
            {
              propName: 'style',
              message:
                'Inline style attributes are forbidden in the design system. Use data-* selectors, cva/sva recipe props, or Panda JSX styled() wrappers.',
            },
          ],
        },
      ],
      // 2. Forbid passing style prop to Ark UI or custom React wrappers
      'react/forbid-component-props': [
        'error',
        {
          forbid: [
            {
              propName: 'style',
              message:
                'Do not pass inline style props to design system components. Expose typed variant props or data-* attributes instead.',
            },
          ],
        },
      ],
      // 3. Enforce static Panda CSS v2 extraction hygiene
      '@pandacss/no-dynamic-styling': 'error',
      '@pandacss/no-important': 'error',
      '@pandacss/no-invalid-token-paths': 'error',
    },
  },
]`;
