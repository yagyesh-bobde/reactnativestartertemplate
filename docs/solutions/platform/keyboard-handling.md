# Keyboard handling

**Library:** `react-native-keyboard-controller` (RNKC). Used for every keyboard-aware screen.

## How it works

- `KeyboardProvider` wraps the app in `src/app/AppProviders.tsx` with `preload`, `statusBarTranslucent` and `navigationBarTranslucent`.
- `preload` warms the keyboard once at startup. Don't call `KeyboardController.preload()` anywhere else.
- Android `MainActivity` declares `android:windowSoftInputMode="adjustResize"` in `AndroidManifest.xml`.
- Jest uses the mock from `react-native-keyboard-controller/jest` (`jest.setup.js`).

## Which component

- Forms / long content with inputs → `KeyboardAwareScrollView`.
- Fixed layout that must lift above the keyboard → `KeyboardAvoidingView` (from RNKC, not `react-native`).
- Input bar pinned to the keyboard (chat composer) → `KeyboardStickyView`.
- Interactive swipe-to-dismiss → `KeyboardGestureArea` (Android).
- Custom animations → `useKeyboardHandler` / `useReanimatedKeyboardAnimation`.
- Dismiss → `KeyboardController.dismiss()`.

## Gotchas

- Keep `adjustResize` in the manifest. RNKC sets the mode at runtime, but async; without the manifest value Android pans the window on the first focus after a cold start and the input jumps ~2x the keyboard height.
- The provider makes Android edge-to-edge, so keyboard and inset values include the status/nav bars. Use safe-area insets, not hardcoded offsets.
- Bug only on cold start? Test with kill + relaunch, not just back navigation. `freezeOnBlur` can hide first-mount bugs.
- `scripts/check-rn-footguns.js` warns on `KeyboardAvoidingView` imported from `react-native`.
