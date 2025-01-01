// commitlint.config.js
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    // 'subject-full-stop': [2, 'never'], // Example: Error if subject ends with a period
  },
};