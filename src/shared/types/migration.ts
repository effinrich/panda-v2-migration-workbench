export type ActiveView = 'overview' | 'blockers' | 'matrix' | 'compare';

export type BlockerSeverity = 'Critical' | 'High' | 'Moderate';

export type BlockerCategory =
  | 'Engine'
  | 'Context API'
  | 'Recipes'
  | 'Config'
  | 'Types'
  | 'CSS Behavior'
  | 'Style Lint';

export interface BlockerItem {
  id: string;
  index: string;
  title: string;
  category: BlockerCategory;
  severity: BlockerSeverity;
  automatablePct: number;
  affectedShare: string;
  affectedComponentsCount: number;
  summary: string;
  rootCause: string;
  v2EngineImpact: string;
  mitigationSteps: string[];
  v1Label: string;
  v2Label: string;
  v1Code: string;
  v2Code: string;
}

export type ComponentCategory = 'Primitive' | 'Form' | 'Overlay' | 'Navigation' | 'Data Display';

export type ComplexityTier = 'Low' | 'Medium' | 'High';

export type StyleLintStatus = 'Compliant' | 'Needs Wrapper Guard' | 'Audit Dynamic Vars';

export type RecipeKind = 'cva' | 'sva';

export interface ComponentAuditItem {
  id: string;
  name: string;
  category: ComponentCategory;
  arkPrimitive: string;
  recipeKind: RecipeKind;
  slotCount: number;
  complexity: ComplexityTier;
  styleLintStatus: StyleLintStatus;
  allowedStylingSurface: string;
  dynamicCssVars: string[];
  pandaV2Gotchas: string[];
  baseMinutes: number;
  lintAuditMinutes: number;
}

export interface ForkScopeConfig {
  componentCount: number;
  teamSize: 1 | 2 | 3;
  node22Ready: boolean;
  enforceNoInlineStyle: boolean;
  usesCustomStyleContext: boolean;
  usesDefineParts: boolean;
  multiPackageMonorepo: boolean;
  visualRegressionSuite: boolean;
}

export interface WorkstreamEstimate {
  id: string;
  label: string;
  hours: number;
  automatablePct: number;
  notes: string;
}

export interface EffortSummary {
  totalHours: number;
  calendarDays: number;
  automatablePct: number;
  difficultyLabel: 'Low-Moderate' | 'Moderate' | 'Moderate-High';
  riskSummary: string;
  workstreams: WorkstreamEstimate[];
  greenfieldArkHours: number;
  hoursSavedByFork: number;
}

export interface DecisionWeights {
  speedToMarket: number;
  bespokeBrandGrammar: number;
  upstreamIndependence: number;
  minimalMaintenanceLoad: number;
}

export interface ComparisonDimension {
  id: string;
  dimension: string;
  category: string;
  parkForkSummary: string;
  arkGreenfieldSummary: string;
  parkScore: number;
  arkScore: number;
  weightKey: keyof DecisionWeights;
  verdictNote: string;
}

export interface LintIssue {
  line: number;
  column: number;
  rule: string;
  severity: 'error' | 'warning';
  message: string;
  snippet: string;
  suggestion: string;
}

export interface LintPreset {
  id: string;
  label: string;
  component: string;
  description: string;
  code: string;
}

export interface PersistedWorkbenchState {
  scope: ForkScopeConfig;
  mitigatedBlockers: string[];
  migratedComponents: string[];
  weights: DecisionWeights;
}
