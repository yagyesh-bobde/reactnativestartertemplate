# React Native Starter Template: Tooling, Config & Structure

Date: 2026-09-30
Status: Draft, awaiting review

## Intent

Turn the near-vanilla RN 0.87.1 template into a production-ready starter, using
`~/Developer/work/app-kavana` as reference. Port only what is generic. Nothing
Kavana-specific or personal (names, IDs, SDKs, app paths) may appear in the template.

Success criteria:

- A fresh clone can `bun install`, and `typecheck`, `lint`, `test` all pass.
- Commits are gated by husky (lint-staged, footgun check, commitlint).
- Android APK/AAB builds and Firebase distribution are runnable by env argument.
- Grep for `kavana` (case-insensitive) and the Kavana Firebase app ID returns nothing.

## Decisions (from brainstorming)

| Topic            | Decision                                                                     |
| ---------------- | ---------------------------------------------------------------------------- |
| Package manager  | bun (kavana uses npm; not ported)                                            |
| Lib versions     | Newest release compatible with RN 0.87.1 (kavana pins are for 0.83)          |
| Runtime pin file | Bun equivalent of `.nvmrc` instead of `.nvmrc` (see Open items)              |
| App scope        | Tooling + core libs + folder structure with sample module                    |
| Excluded         | Firebase/analytics/payment SDKs, Maestro, GitHub Actions CI, `.ruby-version` |

## Phase 1: Tooling (no runtime deps)

### Build scripts (`scripts/build/`)

- `build-apk.sh [env]` (default `development`): validate env, export
  `APP_ENVIRONMENT`, kill Metro (ports 8081/8083), clear JS/Metro caches, delete
  stale generated RN bundle assets, `./gradlew assembleRelease`, optional install.
- `build-aab.sh [env]` (default `production`): same prep, `./gradlew bundleRelease`.
- `distribute-apk.sh [env] [--groups] [--testers] [--release-notes] [--skip-build]`:
  builds then uploads to Firebase App Distribution. Release notes auto-generated
  from commits since the last Android tag unless overridden.
  - App ID comes from env var `FIREBASE_ANDROID_APP_ID`; script exits with a clear
    message if unset. No hardcoded IDs, project names or brand text.
  - Prerequisites documented in the script header (firebase-tools, login or
    `GOOGLE_APPLICATION_CREDENTIALS`).
- Scripts resolve the repo root relative to their own location (they live in a
  subfolder, unlike kavana's root-level scripts).

### package.json scripts

`clean`, `build:apk`, `build:aab`, `distribute:android`, `typecheck`, `lint`,
`lint:fix`, `format`, `format:check`, `check:footguns`, `prepare` (husky).
Existing `android`, `ios`, `start`, `test` are kept.

### Husky (`.husky/`)

- `pre-commit`: `node scripts/check-rn-footguns.js` then `bunx lint-staged`.
- `commit-msg`: `bunx commitlint --edit "$1"`.
- `lint-staged`: `*.{ts,tsx,js,jsx}` -> `prettier --write`, `eslint --fix`;
  `*.{json,md}` -> `prettier --write`.
- `commitlint.config.js` extending `@commitlint/config-conventional`.
- Pre-commit does not run `tsc` (not selected; slows commits).

### Footgun check (`scripts/check-rn-footguns.js`)

Ported from kavana's staged-diff scanner (added lines only, `--strict` flag,
optional file args). Kept: generic rules (leaked render values, `runOnJS`
deprecation, touchables, worklet closure patterns) with references pointing at
`CLAUDE.md`. Removed: kavana image-wrapper exemptions, chat-list path regex,
`docs/errors/*` links. Exact rule list is finalised in the plan after reading the
remaining ~400 lines of the source.

### Config

- **Aliases:** `@/` -> `src/`, plus `@core`, `@shared`, `@navigation`, `@app`
  (kavana's `@features` is dropped; the layout uses `modules/`). Defined in both
  `babel.config.js` (`babel-plugin-module-resolver`) and `tsconfig.json` `paths`.
  Jest gets a matching `moduleNameMapper`.
- **tsconfig:** add `strict`, `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, `allowUnreachableCode: false`,
  `noUncheckedIndexedAccess`. The template's TS is `^6.0.3`, so the flags are
  verified against it (kavana is on 5.0.4).
- **Env:** `react-native-dotenv` in babel (`envName: APP_ENVIRONMENT`, module
  `@env`), typed via `src/types/env.d.ts`. Files: `.env.example` (committed,
  generic keys only: `APP_ENV`, `API_BASE_URL`, `SOCKET_URL`, `ANDROID_APP_ID`,
  `IOS_APP_ID`), `.env.development`, `.env.staging`, `.env.production`.
  `.gitignore` ignores `.env` and `.env.*` except `.env.example`.
- **Lint/format:** eslint 8 with `@react-native` + `prettier`, `eslint-plugin-prettier`
  as error, `eslint-config-prettier`, prettier 3, kavana `.prettierrc` (printWidth 100,
  `arrowParens: always`, `bracketSameLine`). The kavana `no-restricted-imports`
  patterns are app-specific and dropped; one generic barrel-import warning is kept.
  Existing template files get reformatted to the new prettier config in one commit.
- **Repo hygiene:** `patch-package` + `postinstall` and an empty `patches/` dir.

### Docs

- `CLAUDE.md`: generic rules only. Folder layout, module anatomy, import order,
  size-matters styling rule, no `runOnJS`, git branch-prefix and pre-commit rules.
  Kavana's image-wrapper, theme and chat rules are removed.
- `AGENTS.md` is a symlink to `CLAUDE.md`.
- `README.md` gains sections for scripts, env, hooks and build.

## Phase 2: Libs & structure

### Dependencies (versions resolved against RN 0.87.1 in the plan)

`@react-navigation/native`, `native-stack`, `bottom-tabs`,
`react-native-screens`, `@tanstack/react-query`, `zustand`,
`react-native-mmkv` (+ `react-native-nitro-modules`),
`react-native-reanimated` (+ `react-native-worklets`),
`react-native-gesture-handler`, `zod`,
**`react-native-size-matters`** (0.4.2, peer `react-native: *`, JS-only).

### Native wiring

- Babel: `react-native-worklets/plugin` last in the plugin list.
- `index.js`: import `react-native-gesture-handler` first.
- iOS: `bundle exec pod install`. Android: no manual change expected; verified
  during the plan.
- `App.tsx` becomes a thin root that renders `app/AppProviders` (SafeArea,
  GestureHandlerRootView, QueryClientProvider, NavigationContainer).

### Layout

```
src/
  app/          AppProviders, root App
  navigation/   RootNavigator, RootParamList (module augmentation), route enums
  modules/
    example/    sample: api/ (kebab-case file + schemas.ts + keys.ts), queries/,
                stores/, screens/, components/, index.ts (only public entry)
  shared/       ui/, theme/ (size-matters helpers), hooks/, utils/
  core/         api/ client, storage (MMKV), env, logger
  lib/          third-party wrappers
  types/        env.d.ts
```

Sample module demonstrates the anatomy from `CLAUDE.md` end to end. The
`__tests__/App.test.tsx` is updated to render the new root.

## Verification

After each phase: `bun run typecheck`, `bun run lint`, `bun run test`, plus a test
commit that triggers both hooks (including a bad commit message being rejected).
Build scripts are checked with `bash -n` and a dry read only; not executed (no build
commands unless asked). Final grep for Kavana/personal references.

## Open items

1. **Bun version pin file:** `bun` is not installed in this shell, so its version
   can't be read. Proposed: `.bun-version` plus `"packageManager": "bun@<version>"` in
   `package.json`. Confirm which (or both) and the version.
2. **Footgun rule list:** finalised in the plan after reading the rest of the source.
3. **Phase split:** Phase 1 and Phase 2 can ship as separate commits/PRs; confirm
   preference at plan time.
