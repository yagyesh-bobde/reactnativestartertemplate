module.exports = function (api) {
  api.cache(false); // Disable cache so environment variable changes are picked up

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENVIRONMENT',
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: false,
          verbose: false,
        },
      ],
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@core': './src/core',
            '@shared': './src/shared',
            '@navigation': './src/navigation',
            '@app': './src/app',
          },
        },
      ],
      // Must be last
      'react-native-worklets/plugin',
    ],
  };
};
