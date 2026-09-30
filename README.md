# React Native Starter Template

Bare React Native (0.87) starter with the boring setup already done: TypeScript, path aliases,
env handling, data fetching, state, git hooks and Android build scripts. No Expo, no framework.
Package manager: **bun**.

If it saves you a setup day, a ⭐ on the repo helps other people find it.

## Use this template

Click **Use this template** on GitHub, or with the GitHub CLI:

```sh
gh repo create my-app --template yagyesh-bobde/reactnativestartertemplate --private --clone
```

Then start editing in `src/modules/example`, or copy it as the base for your first module.

## What's inside

| Area         | Choice                                                                      |
| ------------ | --------------------------------------------------------------------------- |
| Language     | Strict TypeScript, aliases `@/`, `@core`, `@shared`, `@navigation`, `@app`  |
| Navigation   | `@react-navigation/native-stack`, route enums, typed global `RootParamList` |
| Server state | TanStack Query with `queryOptions` factories, responses validated with zod  |
| Client state | Zustand stores exposed as selector hooks, MMKV for persistence              |
| Animation    | Reanimated 4, react-native-worklets, Gesture Handler                        |
| Styling      | `react-native-size-matters` scaling and a shared theme palette              |
| Env          | `.env.<environment>` picked by `APP_ENVIRONMENT`, imported from `@env`      |
| Guardrails   | ESLint, Prettier, husky, commitlint, lint-staged, RN footgun checks         |
| Releases     | APK/AAB build scripts and Firebase App Distribution                         |

The example module renders the start screen: a query-backed intro, a GitHub card and the
feature list. It shows the module layout end to end (`api/` → `queries/` → `screens/`).

## Setup

```sh
bun install
cp .env.example .env            # plus .env.development / .env.staging / .env.production
bundle install && bundle exec pod install --project-directory=ios
```

## Run

```sh
bun run start
bun run android
bun run ios
```

## Scripts

| Script                               | What it does                                              |
| ------------------------------------ | --------------------------------------------------------- |
| `typecheck`                          | `tsc --noEmit`                                            |
| `lint` / `lint:fix`                  | ESLint (with Prettier as a rule)                          |
| `format` / `format:check`            | Prettier over `src` and root config files                 |
| `test`                               | Jest                                                      |
| `check:footguns`                     | RN footgun scan of staged files (also runs on pre-commit) |
| `clean`                              | Clear watchman and Metro/Babel caches                     |
| `build:apk [env] [--no-install]`     | Release APK, installed on a connected device              |
| `build:aab [env]`                    | Release AAB for Play Store                                |
| `distribute:android [env] [options]` | Release APK to Firebase App Distribution                  |

`env` is `development`, `staging` or `production`; it sets `APP_ENVIRONMENT`, which selects
the `.env.<env>` file.

## Environment

Values are inlined at build time by `react-native-dotenv` and imported from `@env`
(typed in `src/types/env.d.ts`). Only `.env.example` is committed. When adding a key, update
`.env.example` and `src/types/env.d.ts`.

## Git hooks (husky)

- `pre-commit`: footgun check, then lint-staged (Prettier + ESLint on staged files).
- `commit-msg`: commitlint, conventional commits (`feat: ...`, `fix: ...`).

## Distributing to Firebase

```sh
export FIREBASE_ANDROID_APP_ID=1:1234567890:android:abcdef123456
bun run distribute:android staging --groups "qa-team"
```

Requires the Firebase CLI (`bun add -g firebase-tools`) and `firebase login` or
`GOOGLE_APPLICATION_CREDENTIALS`. Flags: `--groups`, `--testers`, `--release-notes`,
`--skip-build`.

## Project structure

See [CLAUDE.md](./CLAUDE.md) (`AGENTS.md` is a symlink to it) for the folder layout, module
anatomy and coding rules.
