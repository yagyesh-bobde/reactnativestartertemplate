const preset = require('@react-native/jest-preset/jest-preset');

module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|react-native-[^/]+|@react-native(-community)?|@react-navigation)/)',
  ],
  setupFiles: [...preset.setupFiles, 'react-native-gesture-handler/jestSetup'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
