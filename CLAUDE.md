## Project Rules

1. Folder layout

```
src/
  app/          bootstrap only: App root, providers
  navigation/   navigators, RootParamList (global module augmentation), route enums
  modules/      ALL domain code. One folder per domain.
  shared/       domain-free React: ui/, theme/, hooks/, utils/
  core/         domain-free infra, no React: api/, storage, env, logger
  lib/          third-party wrappers
  types/        ambient declarations (e.g. @env)
```

2. Module anatomy

```
modules/<domain>/
  api/         one kebab-case file per endpoint, schemas.ts (zod), keys.ts
  queries/     queryOptions factories + use*Query / use*Mutation hooks
  stores/      Zustand, client state only, exported as selector hooks
  screens/     one file per route, thin, composes components
  components/  private to the module
  hooks/ utils/ types.ts
  index.ts     the ONLY file other modules may import from
```

### Git

- Conventional commits (`feat:`, `fix:`, `chore:` ...) are enforced by commitlint.
- No force push, branch delete, or history rewrite.

### Safety

- Pre-commit failure (footgun check, lint-staged) → fix the cause, never skip hooks.
- Breaking-risk changes → ask the user first (even with bypass permissions).
- Config changes → read the docs first, back up before editing.

## Docs

- `docs/crashes/` — crash / ANR / runtime bug + the fix that WORKED (shipped, not reverted). No reports or analysis.
- `docs/solutions/` — major features / systems: how it works, key decisions, gotchas; grouped by area subfolder — add a new area only if none fits.
- `docs/pivots/` — we switched from X to Y (UI, library, logic, API) and why.
- `docs/fuckups/` — mistakes that shipped (or nearly): impact, fix, guardrail, lesson. Check before releases.
- Rules: plain short English, ≤ ~60 lines/doc, one file per topic (kebab-case, no dates), copy the format of that folder, add a line to the bucket `README.md`.
- Plans / specs / design docs / handoffs → `docs/plans/` or `docs/superpowers/` (gitignored — never commit).
- Fixed a crash, shipped a major feature, pivoted, or fucked up → write or update the doc in the same PR.

## Code Rules

- Package manager: bun. Never npm or yarn.
- Never use `any` unless unavoidable.
- Import order: React/RN → external (alphabetical) → `@/` (core → shared → modules) → relative → `import type`.
- Aliases: `@/`, `@core`, `@shared`, `@navigation`, `@app` (babel + tsconfig).
- Env: values come from `.env.<environment>` selected by `APP_ENVIRONMENT`; import them from `@env`.
- Use project wrappers (`src/lib/`, `src/shared/`) over raw library imports; never duplicate existing utils or helpers.
- Don't add test files unless asked.

## React Native Rules

- Styling: `react-native-size-matters` (`scale` / `verticalScale` / `moderateScale`); use the shared theme and palette rather than inline color values.
- Lists: virtualize (FlatList/FlashList); never `ScrollView` + `.map()` for long lists.
- Navigation: `@react-navigation/native-stack`, not the JS stack.
- Touchables: `Pressable`, not `TouchableOpacity`.
- Keyboard: `react-native-keyboard-controller` for every keyboard-aware screen (`KeyboardAwareScrollView`, `KeyboardAvoidingView`, `KeyboardStickyView`), never the `react-native` `KeyboardAvoidingView`. Keep `adjustResize` on `MainActivity`. See `docs/solutions/platform/keyboard-handling.md`.
- UI edits: preserve icons, borders and styling unless asked; check shared components for regressions.
- JSX: guard with `count > 0 ? … : null` or `!!value`; `{n && <X />}` can render a bare `0`.
- Reanimated: no deprecated `runOnJS` (use `scheduleOnRN` with a stable reference); no `setTimeout` as an animation completion callback.
- Native modules: one folder per feature — Android `android/app/src/main/java/<package>/<feature>/`, iOS `ios/<App>/<Feature>/`. Never flat in the parent folder.
- `scripts/check-rn-footguns.js` enforces the rules above on staged files.
