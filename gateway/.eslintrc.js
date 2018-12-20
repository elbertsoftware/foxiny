module.exports = {
  extends: ['airbnb', 'plugin:flowtype/recommended'],
  env: {
    jest: true,
  },
  parser: 'babel-eslint',
  plugins: ['flowtype'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'arrow-parens': ['error', 'as-needed'],
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
      },
    ],
  },
};
