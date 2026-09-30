export const exampleKeys = {
  all: ['example'] as const,
  greeting: () => [...exampleKeys.all, 'greeting'] as const,
};
