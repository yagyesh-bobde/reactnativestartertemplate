# React Native Starter Template

Bare React Native (0.87) starter with TypeScript, path aliases, env handling, git hooks and
Android build scripts. Package manager: **bun**.

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
