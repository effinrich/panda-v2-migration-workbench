import {
  ComparisonDimension,
  ComponentAuditItem,
  DecisionWeights,
  EffortSummary,
  ForkScopeConfig,
  LintIssue,
  WorkstreamEstimate,
} from '../types/migration';
import { MIGRATION_BLOCKERS } from '../data/blockers';
import { ESLINT_NO_INLINE_STYLE_CONFIG } from '../data/comparison';

export const DEFAULT_SCOPE: ForkScopeConfig = {
  componentCount: 42,
  teamSize: 1,
  node22Ready: true,
  enforceNoInlineStyle: true,
  usesCustomStyleContext: true,
  usesDefineParts: true,
  multiPackageMonorepo: false,
  visualRegressionSuite: true,
};

export const DEFAULT_WEIGHTS: DecisionWeights = {
  speedToMarket: 80,
  bespokeBrandGrammar: 50,
  upstreamIndependence: 45,
  minimalMaintenanceLoad: 65,
};

export function calculateEffortSummary(
  scope: ForkScopeConfig,
  inventory: ComponentAuditItem[]
): EffortSummary {
  const scaleFactor = scope.componentCount / inventory.length;

  // 1. Environment, Node 22+, ESM & Config Overhaul
  let envConfigHours = 4.5;
  if (!scope.node22Ready) envConfigHours += 5.5;
  if (scope.multiPackageMonorepo) envConfigHours += 4.5;

  // 2. Mechanical Codemods (Type paths, ComponentProps, RecipeDefinition, createSlotRecipeContext imports)
  const codemodBaseHours = 3.0 + scope.componentCount * 0.08;

  // 3. Recipe & Context Refactor (createStyleContext split, defineParts removal, slot recipes)
  let recipeRefactorHours = scope.componentCount * 0.16;
  if (scope.usesCustomStyleContext) recipeRefactorHours += 3.5;
  if (scope.usesDefineParts) recipeRefactorHours += 4.5 * scaleFactor;

  // 4. Zero-Inline-Style Lint Gate & Wrapper Hardening
  const lintAuditHours = scope.enforceNoInlineStyle
    ? 2.5 + (inventory.reduce((acc, item) => acc + item.lintAuditMinutes, 0) / 60) * scaleFactor
    : 0;

  // 5. Visual Regression QA (nested condition ordering & recipe base vs mixin precedence)
  const visualQaHours = scope.visualRegressionSuite
    ? 3.0 + scope.componentCount * 0.14
    : 1.5 + scope.componentCount * 0.08;

  const workstreams: WorkstreamEstimate[] = [
    {
      id: 'env-config',
      label: 'Engine, Node 22/ESM & panda.config.ts',
      hours: roundHalf(envConfigHours),
      automatablePct: scope.node22Ready ? 75 : 45,
      notes: scope.node22Ready
        ? 'Lockstep @pandacss/* v2 bump, clean .mjs purge, and config schema nesting.'
        : 'Includes Node 22+ runtime upgrade, ESM migration, and panda.config.ts overhaul.',
    },
    {
      id: 'codemods',
      label: 'AST Codemods (Types & Context Imports)',
      hours: roundHalf(codemodBaseHours),
      automatablePct: 92,
      notes:
        'Bulk transform of styled-system/types, ComponentProps, RecipeDefinition, and createSlotRecipeContext.',
    },
    {
      id: 'recipes',
      label: 'Slot Recipes & Context Wrappers',
      hours: roundHalf(recipeRefactorHours),
      automatablePct: scope.usesDefineParts ? 55 : 75,
      notes: scope.usesDefineParts
        ? 'Manual replacement of defineParts(anatomy.build()) plus custom createStyleContext reconciliation.'
        : 'Direct slot recipe cleanup across compound Ark UI wrappers.',
    },
    ...(scope.enforceNoInlineStyle
      ? [
          {
            id: 'style-lint',
            label: 'Zero-Inline-Style Lint & Wrapper Guards',
            hours: roundHalf(lintAuditHours),
            automatablePct: 68,
            notes:
              'ESLint forbid-dom/component-props, Omit<..., "style"> boundaries, and 9 Zag dynamic-var audits.',
          },
        ]
      : []),
    {
      id: 'visual-qa',
      label: 'Selector Precedence & Visual QA',
      hours: roundHalf(visualQaHours),
      automatablePct: 20,
      notes:
        'Verify nested _hover -> _icon selectors and recipe base vs. textStyle/layerStyle precedence.',
    },
  ];

  const totalHours = roundHalf(workstreams.reduce((sum, item) => sum + item.hours, 0));

  // Team parallelization efficiency (diminishing returns past 1 engineer)
  const effectiveDailyCapacity = scope.teamSize === 1 ? 6.5 : scope.teamSize === 2 ? 11.5 : 15.5;
  const calendarDays = Math.max(1.5, roundHalf(totalHours / effectiveDailyCapacity));

  const weightedAutomatable =
    workstreams.reduce((acc, w) => acc + w.hours * w.automatablePct, 0) / Math.max(1, totalHours);
  const automatablePct = Math.round(weightedAutomatable);

  const difficultyLabel: EffortSummary['difficultyLabel'] =
    totalHours <= 24 ? 'Low-Moderate' : totalHours <= 40 ? 'Moderate' : 'Moderate-High';

  const riskSummary =
    difficultyLabel === 'Low-Moderate'
      ? 'Clean Open-Code fork with modern Node/ESM tooling. Majority of changes are mechanical AST codemods.'
      : difficultyLabel === 'Moderate'
        ? 'Predictable migration sprint. Primary manual surface is defineParts removal, zero-inline-style wrapper hardening, and interactive state QA.'
        : 'Higher coordination overhead from Node 22/ESM or monorepo lockstep combined with strict visual regression and lint enforcement.';

  // Greenfield Ark UI + Panda v2 baseline estimate (~6.5 hrs avg per production component including states, animations, docs, a11y QA + 24h foundation)
  const greenfieldArkHours = Math.round(24 + scope.componentCount * 6.5);
  const hoursSavedByFork = Math.max(0, Math.round(greenfieldArkHours - totalHours));

  return {
    totalHours,
    calendarDays,
    automatablePct,
    difficultyLabel,
    riskSummary,
    workstreams,
    greenfieldArkHours,
    hoursSavedByFork,
  };
}

export interface ComparisonVerdict {
  parkWeightedScore: number;
  arkWeightedScore: number;
  recommendedPath: 'park-fork' | 'ark-greenfield' | 'balanced';
  headline: string;
  rationale: string;
}

export function calculateComparisonVerdict(
  dimensions: ComparisonDimension[],
  weights: DecisionWeights
): ComparisonVerdict {
  let parkTotal = 0;
  let arkTotal = 0;
  let weightSum = 0;

  for (const dim of dimensions) {
    const w = Math.max(10, weights[dim.weightKey]);
    parkTotal += dim.parkScore * w;
    arkTotal += dim.arkScore * w;
    weightSum += w;
  }

  const parkWeightedScore = Math.round(parkTotal / Math.max(1, weightSum));
  const arkWeightedScore = Math.round(arkTotal / Math.max(1, weightSum));
  const delta = parkWeightedScore - arkWeightedScore;

  if (delta >= 5) {
    return {
      parkWeightedScore,
      arkWeightedScore,
      recommendedPath: 'park-fork',
      headline: 'Branch Open-Code Park UI & Upgrade to Panda v2',
      rationale:
        'Your priority weighting favors shipping 30-50 accessible React components rapidly. Migrating local Park UI recipes to Panda v2 takes days rather than months and lands on the exact same Ark UI + Rust/Oxc runtime.',
    };
  }

  if (delta <= -5) {
    return {
      parkWeightedScore,
      arkWeightedScore,
      recommendedPath: 'ark-greenfield',
      headline: 'Build Greenfield on Ark UI + Panda v2',
      rationale:
        'Your weighting prioritizes bespoke brand token grammar, zero legacy recipe reconciliation, and day-one wrapper enforcement over immediate 40-component coverage. Authoring directly on Ark UI + Panda v2 avoids fighting Park UI defaults.',
    };
  }

  return {
    parkWeightedScore,
    arkWeightedScore,
    recommendedPath: 'balanced',
    headline: 'Hybrid Strategy: Fork Core Primitives, Rewrite Flagship Components',
    rationale:
      'Both paths score within 4 points under your priorities. Adopt Park UI open-code recipes for standard form/overlay primitives (migrated to Panda v2 + Omit style) while authoring bespoke brand-defining components fresh on Ark UI + Panda v2.',
  };
}

/**
 * Live in-browser static linter enforcing:
 * 1. Zero inline JSX `style={...}` or `style="..."` attributes
 * 2. Zero unguarded `style` prop forwarding in design system components
 * 3. Panda v2 migration checks (`createStyleContext`, `ComponentPropsOf`, `defineParts`, `styled-system/tokens`)
 */
export function lintComponentSnippet(source: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const lines = source.split('\n');

  lines.forEach((rawLine, idx) => {
    const lineNum = idx + 1;
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) {
      return;
    }

    // Rule 1: Inline JSX style attribute (`style={...}` or `style="..."`)
    const jsxStyleMatch = /\bstyle\s*=\s*(\{[\s\S]*\}|["'][^"']*["'])/.exec(rawLine);
    if (jsxStyleMatch) {
      issues.push({
        line: lineNum,
        column: jsxStyleMatch.index + 1,
        rule: 'react/forbid-dom-props (no-inline-style)',
        severity: 'error',
        message:
          'Forbidden inline style attribute detected in JSX. Design system components must not render inline styles.',
        snippet: trimmed,
        suggestion:
          'Move dynamic visual states into data-* attributes (e.g., data-density, data-depth), cva/sva recipe variants, or Panda JSX styled() wrapper CSS.',
      });
    }

    // Rule 2: Destructuring or forwarding `style` prop in component signature
    const destructureStyleMatch = /\{\s*[^}]*\bstyle\b[^}]*\}\s*:\s*\w+/.exec(rawLine);
    if (destructureStyleMatch) {
      issues.push({
        line: lineNum,
        column: destructureStyleMatch.index + 1,
        rule: 'design-system/no-style-prop-leak',
        severity: 'error',
        message: 'Component signature accepts and forwards the inline `style` prop.',
        snippet: trimmed,
        suggestion:
          'Remove `style` from props and type exports with `Omit<ComponentProps<...>, "style">`.',
      });
    }

    // Rule 3: Panda v1 `createStyleContext`
    const legacyCtxMatch = /\bcreateStyleContext\b/.exec(rawLine);
    if (legacyCtxMatch) {
      issues.push({
        line: lineNum,
        column: legacyCtxMatch.index + 1,
        rule: 'panda-v2/split-style-context',
        severity: 'error',
        message: '`createStyleContext` was removed in Panda CSS v2 and split by recipe type.',
        snippet: trimmed,
        suggestion:
          'Replace with `createSlotRecipeContext` (for sva) or `createRecipeContext` (for cva) from `styled-system/jsx`.',
      });
    }

    // Rule 4: Panda v1 `ComponentPropsOf`
    const legacyPropsMatch = /\bComponentPropsOf\b/.exec(rawLine);
    if (legacyPropsMatch) {
      issues.push({
        line: lineNum,
        column: legacyPropsMatch.index + 1,
        rule: 'panda-v2/component-props-rename',
        severity: 'error',
        message: '`ComponentPropsOf` has been standardized to `ComponentProps` in Panda v2.',
        snippet: trimmed,
        suggestion:
          'Import `ComponentProps` from `styled-system/types` and wrap with `Omit<ComponentProps<...>, "style">`.',
      });
    }

    // Rule 5: Panda v1 `defineParts`
    const definePartsMatch = /\bdefineParts\b/.exec(rawLine);
    if (definePartsMatch) {
      issues.push({
        line: lineNum,
        column: definePartsMatch.index + 1,
        rule: 'panda-v2/no-define-parts',
        severity: 'error',
        message: '`defineParts` was removed in Panda CSS v2.',
        snippet: trimmed,
        suggestion:
          'Use `defineSlotRecipe` with an explicit `slots: [...]` array matching Ark UI part names.',
      });
    }

    // Rule 6: Panda v1 token type import path
    const tokenImportMatch = /from\s+['"]styled-system\/tokens['"]/.exec(rawLine);
    if (tokenImportMatch && /\b(Token|SizeToken)\b/.test(rawLine)) {
      issues.push({
        line: lineNum,
        column: tokenImportMatch.index + 1,
        rule: 'panda-v2/token-type-path',
        severity: 'warning',
        message: '`Token` and `SizeToken` moved to `styled-system/types` in Panda v2.',
        snippet: trimmed,
        suggestion: "Change import path to `from 'styled-system/types'`.",
      });
    }
  });

  // Check if exported props omit `style` when `ComponentProps` is used
  const hasComponentPropsExport =
    /export\s+(type|interface)\s+\w+Props/.test(source) && /ComponentProps/.test(source);
  const omitsStyle = /Omit<[^;>]+,\s*['"]style['"]/.test(source);
  if (hasComponentPropsExport && !omitsStyle) {
    const propLineIdx = lines.findIndex((l) => /export\s+(type|interface)\s+\w+Props/.test(l));
    issues.push({
      line: propLineIdx >= 0 ? propLineIdx + 1 : 1,
      column: 1,
      rule: 'design-system/omit-style-prop-type',
      severity: 'warning',
      message:
        'Exported component Props inherit `ComponentProps` without explicitly omitting `style`.',
      snippet: propLineIdx >= 0 ? lines[propLineIdx].trim() : '',
      suggestion:
        'Wrap exported prop types in `Omit<ComponentProps<...>, "style">` to enforce zero inline styles at compile time.',
    });
  }

  return issues;
}

export function generateMarkdownBrief(
  scope: ForkScopeConfig,
  effort: EffortSummary,
  verdict: ComparisonVerdict,
  mitigatedBlockers: string[],
  migratedComponents: string[],
  inventory: ComponentAuditItem[]
): string {
  const openBlockers = MIGRATION_BLOCKERS.filter((b) => !mitigatedBlockers.includes(b.id));
  const dynamicVarComponents = inventory.filter((c) => c.styleLintStatus === 'Audit Dynamic Vars');

  return `# Architecture Brief: Park UI Fork (Panda v2) vs. Greenfield Ark UI + Panda v2

## 1. Executive Verdict
- **Target Scope**: ${scope.componentCount} React components (Open-Code Park UI CLI baseline)
- **Migration Difficulty**: **${effort.difficultyLabel}** (${effort.totalHours} eng hours / ~${effort.calendarDays} calendar days with ${scope.teamSize} engineer${scope.teamSize > 1 ? 's' : ''})
- **Automatable Share**: ~${effort.automatablePct}% codemod-automatable
- **Greenfield Ark UI + Panda v2 Alternative**: ~${effort.greenfieldArkHours} eng hours (~${effort.hoursSavedByFork} hours saved by branching Open-Code Park UI)
- **Recommended Path (Current Weights)**: **${verdict.headline}** (Park Fork ${verdict.parkWeightedScore} vs. Ark Greenfield ${verdict.arkWeightedScore})
- **Rationale**: ${verdict.rationale}

## 2. Workstream Effort Breakdown
${effort.workstreams
  .map((w) => `- **${w.label}**: ${w.hours}h (~${w.automatablePct}% automatable) — ${w.notes}`)
  .join('\n')}

## 3. Active Migration Blockers (${mitigatedBlockers.length}/${MIGRATION_BLOCKERS.length} Mitigated)
${
  openBlockers.length === 0
    ? '_All 7 blockers marked mitigated._'
    : openBlockers
        .map(
          (b) =>
            `- **[${b.severity}] ${b.title}** (${b.category}, ~${b.automatablePct}% automatable): ${b.summary}`
        )
        .join('\n')
}

## 4. Zero-Inline-Style Policy & Lint Gate
- **Policy Status**: ${scope.enforceNoInlineStyle ? 'Enforced across all components (data-* attributes, recipe props, and Panda JSX wrappers only)' : 'Not enabled in current scope'}
- **Component Audit Progress**: ${migratedComponents.length}/${inventory.length} components verified
- **Ark/Zag Dynamic CSS Variable Audits (${dynamicVarComponents.length} components)**: ${dynamicVarComponents.map((c) => c.name).join(', ')}

\`\`\`js
${ESLINT_NO_INLINE_STYLE_CONFIG}
\`\`\`
`;
}

function roundHalf(value: number): number {
  return Math.round(value * 2) / 2;
}
