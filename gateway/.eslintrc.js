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
    'no-param-reassign': ['error', { props: false }],
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
      },
    ],
  },
};
