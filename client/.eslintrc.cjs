module.exports = {
  env: {
    browser: true, // Allows global browser variables like 'window' and 'document'
    es2020: true,  // Sets ECMAScript features to be available, like optional chaining
    node: true,    // Allows global Node.js variables like 'process' and 'module'
  },
  extends: [
    'eslint:recommended', // Uses ESLint's recommended rules as the base
    'plugin:react/recommended', // Adds React specific rules recommended by the plugin
    'plugin:react/jsx-runtime', // Allows automatic JSX transform introduced in React 17+
    'plugin:react-hooks/recommended', // Adds rules for Hooks (e.g., checking dependencies in useEffect)
    'plugin:@typescript-eslint/recommended', // Adds recommended TypeScript rules
  ],
  parser: '@typescript-eslint/parser', // Specifies the parser for TypeScript files
  parserOptions: {
    ecmaVersion: 'latest', // Allows modern ECMAScript features
    sourceType: 'module',  // Allows the use of ES modules
    ecmaFeatures: {
      jsx: true, // Allows parsing of JSX
    },
  },
  settings: {
    react: {
      version: '18.2', // Automatically detects the React version. '18.2' is the latest stable
    },
  },
  plugins: [
    'react-refresh', // Plugin for React Fast Refresh to aid in the development environment
    '@typescript-eslint', // Plugin for integrating TypeScript linting rules
    'react', // React plugin to enforce React specific linting rules
  ],
  rules: {
    'react-refresh/only-export-components': 'warn', // Warns if non-component code is exported in React files
    'react/prop-types': 'off', // Disables prop-types checking, as you're using TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Disallows unused variables except those with a name starting with "_"
    '@typescript-eslint/no-explicit-any': 'warn', // Warns when 'any' is used in TypeScript code
    'react/react-in-jsx-scope': 'off', // Disables rule requiring 'React' in scope for JSX in React 17+
  },
};
