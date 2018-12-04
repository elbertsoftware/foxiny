module.exports = {
  extends: ['airbnb', 'plugin:flowtype/recommended'],
  env: {
    jest: true,
  },
  parser: 'babel-eslint',
  plugins: ['flowtype'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
