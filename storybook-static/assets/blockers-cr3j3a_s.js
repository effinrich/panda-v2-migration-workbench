import{n as e}from"./rolldown-runtime-sJBDdmOt.js";var t;function n(){return(n=e((()=>{t=[{id:`engine-esm-lockstep`,index:`01`,title:`Rust/Oxc Compiler, Node 22+, ESM-Only & Clean Artifact Reset`,category:`Engine`,severity:`Critical`,automatablePct:85,affectedShare:`Build pipeline, CI, Storybook & monorepo root`,affectedComponentsCount:42,summary:`Panda v2 replaces Node.js ts-morph extraction with a native Rust/Oxc compiler (@pandacss/compiler). All @pandacss/* packages must bump in lockstep on Node 22+ with native ESM, and stale v1 .mjs artifacts must be purged.`,rootCause:`Panda v1 emitted .mjs files in styled-system by default, whereas v2 emits .js under native ESM. Bundlers such as Vite resolve .mjs ahead of .js, causing silent runtime collisions if panda codegen --clean is skipped. Legacy CJS panda.config.js files and Node 18/20 runners fail immediately.`,v2EngineImpact:`Once cleared, single-pass Oxc parsing skips non-Panda files, yielding 15-37x extraction speedups, ~360x faster watch re-parses, and ~99% fewer TypeScript type instantiations—removing the need for discontinued @pandacss/typescript-plugin.`,mitigationSteps:[`Upgrade local dev, CI, and container runtimes to Node.js 22+ and set "type": "module" in package.json.`,`Upgrade every @pandacss/* dependency (dev, postcss, vite/webpack, preset-base) to v2 in lockstep; remove @pandacss/typescript-plugin and @pandacss/language-server.`,`Run panda codegen --clean and panda build --clean to wipe stale v1 .mjs outputs in styled-system/.`,`Audit build logs for pure_helper_unevaluated warnings where runtime loops or non-static helpers previously dropped styles silently.`],v1Label:`package.json & CLI (Panda v1)`,v2Label:`package.json & CLI (Panda v2)`,v1Code:`{
  "engines": { "node": ">=18.18.0" },
  "devDependencies": {
    "@pandacss/dev": "^0.54.0",
    "@pandacss/postcss": "^0.54.0",
    "@pandacss/typescript-plugin": "^0.54.0"
  },
  "scripts": {
    "prepare": "panda codegen"
  }
}`,v2Code:`{
  "type": "module",
  "engines": { "node": ">=22.0.0" },
  "devDependencies": {
    "@pandacss/dev": "^2.0.0",
    "@pandacss/postcss": "^2.0.0",
    "@pandacss/preset-base": "^2.0.0"
  },
  "scripts": {
    "prepare": "panda codegen --clean",
    "build:css": "panda build --clean"
  }
}`},{id:`create-style-context-split`,index:`02`,title:`createStyleContext Split & ComponentProps Standardization`,category:`Context API`,severity:`Critical`,automatablePct:75,affectedShare:`31 of 42 compound Ark UI wrappers + lib/create-style-context.tsx`,affectedComponentsCount:31,summary:`Panda v2 removes the single createStyleContext helper from styled-system/jsx and splits it into createSlotRecipeContext (for sva) and createRecipeContext (for cva), while standardizing ComponentPropsOf to ComponentProps.`,rootCause:`Open-Code Park UI components rely heavily on createStyleContext(recipe) to wire Ark UI compound primitives (Accordion, Dialog, Select, Menu, Tabs, etc.) via withProvider and withContext. Forked repos with a local lib/create-style-context.tsx wrapper also frequently reference v1 SlotRecipeRuntimeFn internals and ComponentPropsOf.`,v2EngineImpact:`Dedicated slot vs. single recipe context helpers eliminate deep generic inference overhead inside React compound trees and keep Oxc JSX extraction deterministic.`,mitigationSteps:[`Replace createStyleContext imports with createSlotRecipeContext from styled-system/jsx across all 31 multi-part Ark UI wrappers (and createRecipeContext for single-slot wrappers).`,`If your Park UI fork maintains a custom lib/create-style-context.tsx, delete the legacy wrapper or re-implement it as a thin typed facade over Panda v2 createSlotRecipeContext that also omits the inline style prop.`,`Run a TS codemod replacing ComponentPropsOf<...> with ComponentProps<...> across component index exports.`],v1Label:`components/ui/card.tsx (Park UI + Panda v1)`,v2Label:`components/ui/card.tsx (Panda v2)`,v1Code:`import { ark } from '@ark-ui/react/factory'
import { createStyleContext } from 'styled-system/jsx'
import type { ComponentPropsOf } from 'styled-system/types'
import { card } from 'styled-system/recipes'

const { withProvider, withContext } = createStyleContext(card)

export const Root = withProvider(ark.div, 'root')
export const Header = withContext(ark.div, 'header')
export const Body = withContext(ark.div, 'body')

export type RootProps = ComponentPropsOf<typeof Root>`,v2Code:`import { ark } from '@ark-ui/react/factory'
import { createSlotRecipeContext } from 'styled-system/jsx'
import type { ComponentProps } from 'styled-system/types'
import { card } from 'styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(card)

export const Root = withProvider(ark.div, 'root')
export const Header = withContext(ark.div, 'header')
export const Body = withContext(ark.div, 'body')

export type RootProps = Omit<ComponentProps<typeof Root>, 'style'>`},{id:`define-parts-and-recipe-types`,index:`03`,title:`defineParts Removal & RecipeDefinition Type Refactor`,category:`Recipes`,severity:`High`,automatablePct:65,affectedShare:`Slot recipes using anatomy.build() and shared recipe helpers`,affectedComponentsCount:18,summary:`defineParts is removed in Panda v2. Any slot recipe mapping Ark UI anatomy parts via defineParts(anatomy.build()) must migrate to explicit slot keys in defineSlotRecipe, and RecipeConfig/SlotRecipeConfig are renamed to RecipeDefinition/SlotRecipeDefinition.`,rootCause:`Earlier Park UI recipes used anatomy builders with defineParts to auto-generate selector maps, and typed local recipe files with RecipeConfig / SlotRecipeConfig. In v2, configuration-only fields (className, jsx, staticCss, description) were stripped from runtime definitions.`,v2EngineImpact:`Eliminating dynamic defineParts indirection lets the Rust/Oxc engine statically inspect slot keys and variant matrices in a single AST pass without evaluating anatomy builder functions.`,mitigationSteps:[`Grep recipes/ for defineParts and anatomy.build(); convert each to defineSlotRecipe with an explicit slots array matching Ark UI data-part names.`,`Replace RecipeConfig and SlotRecipeConfig imports with RecipeDefinition and SlotRecipeDefinition (or import full config types from @pandacss/types where className/staticCss metadata is needed).`,`Remove any tagged template literal style declarations; Panda v2 strictly supports object syntax.`],v1Label:`theme/recipes/accordion.ts (Panda v1)`,v2Label:`theme/recipes/accordion.ts (Panda v2)`,v1Code:`import { accordionAnatomy } from '@ark-ui/react/accordion'
import { defineParts, defineRecipe } from '@pandacss/dev'
import type { SlotRecipeConfig } from 'styled-system/types'

const parts = defineParts(accordionAnatomy.build())

export const accordionRecipe: SlotRecipeConfig = defineRecipe({
  className: 'accordion',
  base: parts({
    root: { width: 'full', divideY: '1px' },
    itemTrigger: { display: 'flex', justifyContent: 'space-between' },
    itemContent: { color: 'fg.muted' },
  }),
})`,v2Code:`import { defineSlotRecipe } from '@pandacss/dev'
import type { SlotRecipeDefinition } from 'styled-system/types'

export const accordionRecipe = defineSlotRecipe({
  className: 'accordion',
  slots: ['root', 'item', 'itemTrigger', 'itemContent', 'itemIndicator'],
  base: {
    root: { width: 'full', divideY: '1px' },
    itemTrigger: { display: 'flex', justifyContent: 'space-between' },
    itemContent: { color: 'fg.muted' },
  },
}) satisfies SlotRecipeDefinition<
  'root' | 'item' | 'itemTrigger' | 'itemContent' | 'itemIndicator'
>`},{id:`config-schema-overhaul`,index:`04`,title:`panda.config.ts Schema Restructuring & Explicit Presets`,category:`Config`,severity:`High`,automatablePct:60,affectedShare:`Root panda.config.ts, custom theme presets, and token files`,affectedComponentsCount:42,summary:`Nine top-level config options are removed, global styles and theme mixins are nested under new namespaces, and @pandacss/preset-base is no longer injected implicitly.`,rootCause:`Park UI starter configs typically define globalCss, globalVars, themes, textStyles, layerStyles, and animationStyles at the top level while omitting explicit @pandacss/preset-base. Panda v2 drops studio, eject, emitTokensOnly, gitignore, clean, watch, poll, lightningcss, and browserslist, and changes forceConsistentTypeExtension to forceImportExtension with different semantics.`,v2EngineImpact:`Explicit presets and consolidated namespaces allow the native Rust config loader to resolve design tokens deterministically without implicit runtime merges.`,mitigationSteps:[`Explicitly add "@pandacss/preset-base" (and "@pandacss/preset-panda" if used) into the presets array.`,`Nest globalCss, globalFontface, globalVars, and globalPositionTry inside global: { css, fontface, vars, positionTry }.`,`Move theme.textStyles, theme.layerStyles, and theme.animationStyles under theme.mixins, and migrate top-level themes to theme.variants.`,`Strip removed keys (studio, eject, clean, watch, lightningcss, browserslist, etc.) and review forceImportExtension if using NodeNext module resolution.`],v1Label:`panda.config.ts (Park UI + Panda v1)`,v2Label:`panda.config.ts (Panda v2)`,v1Code:`import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  clean: true,
  lightningcss: true,
  globalCss: { body: { bg: 'bg.canvas', color: 'fg.default' } },
  themes: { light: { /* ... */ }, dark: { /* ... */ } },
  theme: {
    extend: {
      textStyles: { heading: { value: { fontWeight: '600' } } },
      layerStyles: { panel: { value: { borderWidth: '1px' } } },
    },
  },
})`,v2Code:`import { defineConfig } from '@pandacss/dev'
import presetBase from '@pandacss/preset-base'

export default defineConfig({
  presets: [presetBase],
  preflight: true,
  outExtension: 'js',
  global: {
    css: { body: { bg: 'bg.canvas', color: 'fg.default' } },
  },
  theme: {
    variants: { light: { /* ... */ }, dark: { /* ... */ } },
    extend: {
      mixins: {
        textStyles: { heading: { value: { fontWeight: '600' } } },
        layerStyles: { panel: { value: { borderWidth: '1px' } } },
      },
    },
  },
})`},{id:`type-import-paths`,index:`05`,title:`Generated Type Import Path Relocations`,category:`Types`,severity:`Moderate`,automatablePct:95,affectedShare:`Utility wrappers, design-token helpers, and prop interfaces`,affectedComponentsCount:26,summary:`Token and SizeToken move from styled-system/tokens to styled-system/types, while types/prop-type (UtilityValues) and CssProperties are deleted in favor of SystemStyleObject and SystemProperties.`,rootCause:`Open-Code Park UI primitives (Icon, Heading, Text, Box, Stack wrappers) and custom token utilities frequently import Token from styled-system/tokens or CssProperties from styled-system/types.`,v2EngineImpact:`Flattening generated type exports directly contributes to Panda v2’s ~99% drop in TypeScript instantiation count and eliminates IDE sluggishness in 40+ component workspaces.`,mitigationSteps:[`Run a single AST codemod moving Token and SizeToken imports from styled-system/tokens to styled-system/types.`,`Replace deleted UtilityValues and CssProperties references with SystemStyleObject or SystemProperties from styled-system/types.`,`Run tsc --noEmit across the component library and consuming apps to verify zero unresolved type imports.`],v1Label:`components/ui/icon.tsx (Panda v1)`,v2Label:`components/ui/icon.tsx (Panda v2)`,v1Code:`import type { Token, SizeToken } from 'styled-system/tokens'
import type { CssProperties } from 'styled-system/types'
import type { UtilityValues } from 'styled-system/types/prop-type'

export interface IconStyleProps {
  color?: Token
  boxSize?: SizeToken
  extra?: CssProperties
}`,v2Code:`import type {
  Token,
  SizeToken,
  SystemStyleObject,
} from 'styled-system/types'

export interface IconStyleProps {
  color?: Token
  boxSize?: SizeToken
  css?: SystemStyleObject
}`},{id:`selector-precedence-regressions`,index:`06`,title:`Nested Condition Ordering & Recipe Property Precedence Shifts`,category:`CSS Behavior`,severity:`High`,automatablePct:15,affectedShare:`Interactive states in Button, Menu, Select, Combobox, Tabs & Dialog`,affectedComponentsCount:16,summary:`Panda v2 fixes two longstanding v1 compiler bugs: nested conditions now preserve outer-to-inner selector order, and recipe base styles now correctly override conflicting textStyle/layerStyle/animationStyle mixins.`,rootCause:`In v1, nested conditions like _hover: { _icon: { color: "accent.fg" } } could emit inverted specificity selectors, and textStyle declarations accidentally trumped explicit base fontWeight/lineHeight overrides. Park UI recipes tuned by eye against v1 output can show subtle hover/icon color or typography shifts after upgrading.`,v2EngineImpact:`The Rust CSS emitter outputs deterministic cascade ordering, making styles far more predictable long-term—but requiring a targeted visual diff pass on interactive states.`,mitigationSteps:[`Audit all recipes combining _hover/_focus/_selected with nested _icon, _before, or _after conditions.`,`Inspect recipes declaring both textStyle/layerStyle and explicit fontSize, fontWeight, or borderColor in base/variants.`,`Run Storybook screenshot diffs (Chromatic/Playwright) across hover, focus-visible, open, and disabled states on the 16 flagged interactive components.`],v1Label:`Subtle v1 Precedence Quirk (Button / Menu)`,v2Label:`Deterministic v2 Selector & Precedence`,v1Code:`// In v1, textStyle could override explicit base fontWeight,
// and nested _hover -> _icon suffered inverted selector bugs
export const buttonRecipe = defineRecipe({
  base: {
    textStyle: 'sm',
    fontWeight: 'semibold', // could lose to textStyle in v1
    _hover: {
      _icon: { color: 'fg.default' }, // inconsistent selector order
    },
  },
})`,v2Code:`// In v2, explicit base properties reliably override mixins
// and nested conditions compile cleanly to .x:hover :where(svg)
export const buttonRecipe = defineRecipe({
  base: {
    textStyle: 'sm',
    fontWeight: 'semibold', // reliably wins over textStyle
    '&[data-state="open"]': { bg: 'bg.subtle' },
    _hover: {
      _icon: { color: 'fg.default' }, // deterministic .x:hover :where(svg)
    },
  },
})`},{id:`zero-inline-style-lint-gate`,index:`07`,title:`Zero-Inline-Style Lint Gate & JSX Wrapper Hygiene`,category:`Style Lint`,severity:`High`,automatablePct:70,affectedShare:`All 42 design system components (9 Ark/Zag dynamic-var audits)`,affectedComponentsCount:42,summary:`Enforcing zero inline style={...} attributes across the entire design system restricts styling exclusively to data-* attributes, recipe props, or Panda JSX styled() wrappers—requiring both ESLint enforcement and TypeScript Omit<..., "style"> guards.`,rootCause:`Open-Code Park UI wrappers forward all HTML/Ark props verbatim, leaving style={...} open at both the component implementation and consumer callsite layers. Additionally, 9 Ark UI / Zag.js components (Slider, Progress, Popover, Tooltip, Select, Combobox, HoverCard, DatePicker, Splitter) compute internal CSS custom properties (--x, --y, --percent) inside Zag DOM props—which must stay encapsulated inside Ark primitives and never leak into author-written JSX style attributes.`,v2EngineImpact:`Zero inline style attributes align cleanly with Panda v2’s Rust/Oxc static extraction: every visual state compiles into static atomic CSS keyed off data-* attributes, recipe props, or JSX component wrappers with zero runtime style objects.`,mitigationSteps:[`Enable ESLint react/forbid-dom-props and react/forbid-component-props forbidding the "style" prop across packages/ui/src/**.`,`Wrap createSlotRecipeContext and styled() factory types with Omit<ComponentProps<T>, "style"> so TypeScript blocks inline style props at compile time.`,`Refactor any conditional inline styles (e.g., width, opacity, transform) into data-* state attributes (data-orientation, data-density, data-active) or recipe variants styled in JSX wrappers.`,`For the 9 Zag.js dynamic-var primitives (Slider, Progress, Popover, etc.), verify that positioning/fill consumes Zag-emitted CSS variables via static recipe rules (e.g., width: "var(--percent)") with zero JSX style={...} attributes.`],v1Label:`Non-Compliant Wrapper (Permits Inline style)`,v2Label:`Lint-Enforced Panda v2 JSX Wrapper (No style)`,v1Code:`// ❌ Allows inline style prop leakage & runtime style object
export function ProgressBar({ value, isIndeterminate, style }: Props) {
  return (
    <ArkProgress.Root value={value} style={style}>
      <ArkProgress.Track>
        <ArkProgress.Range
          style={{ width: isIndeterminate ? '40%' : \`\${value}%\` }}
        />
      </ArkProgress.Track>
    </ArkProgress.Root>
  )
}`,v2Code:`// ✅ Data-attribute & JSX wrapper styling only (style prop forbidden)
import { Progress as ArkProgress } from '@ark-ui/react/progress'
import { createSlotRecipeContext } from 'styled-system/jsx'
import type { ComponentProps } from 'styled-system/types'
import { progressRecipe } from 'styled-system/recipes'

const { withProvider, withContext } = createSlotRecipeContext(progressRecipe)

// Omit<'style'> enforces zero inline styles at the type boundary
export type RootProps = Omit<ComponentProps<typeof ArkProgress.Root>, 'style'>

// Static recipe maps Zag data-state & CSS vars without JSX style={}
export const Root = withProvider(ArkProgress.Root, 'root')
export const Track = withContext(ArkProgress.Track, 'track')
export const Range = withContext(ArkProgress.Range, 'range')`}]})))()}export{n,t};