export const REPO_SLUG = 'yagyesh-bobde/reactnativestartertemplate';
export const REPO_URL = `https://github.com/${REPO_SLUG}`;

export const FEATURES = [
  { title: 'Strict TypeScript', description: 'Path aliases for @/, @core, @shared and more.' },
  { title: 'Typed native stack', description: 'Route enums with a global RootParamList.' },
  { title: 'TanStack Query + zod', description: 'Every response validated before it hits the UI.' },
  { title: 'Zustand + MMKV', description: 'Selector-hook stores and fast persistent storage.' },
  { title: 'Reanimated 4', description: 'Worklets and Gesture Handler, ready to animate.' },
  { title: 'Guardrails', description: 'Husky, commitlint, lint-staged and RN footgun checks.' },
  { title: 'Android releases', description: 'APK, AAB and Firebase distribution scripts.' },
] as const;
