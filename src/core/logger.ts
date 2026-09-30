const enabled = __DEV__;

export const logger = {
  debug: (...args: unknown[]) => enabled && console.debug(...args),
  info: (...args: unknown[]) => enabled && console.info(...args),
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
};
