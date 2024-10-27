module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true, // Add this line
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended', // Add TypeScript recommended rules
  ],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: '18.2', // Specifies React version for plugin settings
    },
  },
  plugins: ['react-refresh', '@typescript-eslint', 'react'], // Add TypeScript ESLint plugin
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Prevent unused vars, ignore unused function arguments starting with _
    '@typescript-eslint/no-explicit-any': 'warn', // Warn when 'any' is used
    'react/react-in-jsx-scope': 'off', // Disable rule for 'React' in scope for React 17+
  },
};
