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

## Code Rules

- Package manager: bun. Never npm or yarn.
- Never use `any` unless unavoidable.
- Import order: React/RN → external (alphabetical) → `@/` (core → shared → modules) → relative → `import type`.
- Aliases: `@/`, `@core`, `@shared`, `@navigation`, `@app` (babel + tsconfig).
- Env: values come from `.env.<environment>` selected by `APP_ENVIRONMENT`; import them from `@env`.

## React Native Rules

- Styling: `react-native-size-matters` (`scale` / `verticalScale` / `moderateScale`); use the shared theme and palette rather than inline color values.
- Lists: virtualize (FlatList/FlashList); never `ScrollView` + `.map()` for long lists.
- Navigation: `@react-navigation/native-stack`, not the JS stack.
- Touchables: `Pressable`, not `TouchableOpacity`.
- JSX: guard with `count > 0 ? … : null` or `!!value`; `{n && <X />}` can render a bare `0`.
- Reanimated: no deprecated `runOnJS` (use `scheduleOnRN` with a stable reference); no `setTimeout` as an animation completion callback.
- `scripts/check-rn-footguns.js` enforces the rules above on staged files.
