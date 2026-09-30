module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    // Import from a module's public entry (modules/<domain>), not its internals via barrels of barrels.
    'no-restricted-imports': [
      'warn',
      {
        patterns: [
          {
            group: ['**/index/index'],
            message:
              'Avoid nested barrel imports. Import from the module entry or the file itself.',
          },
        ],
      },
    ],
  },
};
