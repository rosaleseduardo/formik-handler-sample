import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import tsdoc from 'eslint-plugin-tsdoc';
import globals from 'globals';

import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import pluginJs from '@eslint/js';


/**
 * - Configuration Files
 *
 * Reference: https://eslint.org/docs/latest/use/configure/configuration-files
 *
 * - Custom Configurations:
 *
 * 1. https://eslint.org/docs/latest/rules
 * 2. https://www.npmjs.com/package/eslint-plugin-simple-import-sort
 * 3. https://www.npmjs.com/package/eslint-plugin-react-hooks
 * 4.⁠ ⁠https://www.npmjs.com/package/eslint-plugin-react
 * 5. https://www.npmjs.com/package/eslint-plugin-import
 * 6. https://www.npmjs.com/package/@typescript-eslint/parser
 * 7. https://www.npmjs.com/package/@eslint/js
 * 8. https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
 * 9. https://www.npmjs.com/package/eslint-plugin-prettier
 */
export default [
  { files: ['**/*.{ts,tsx}'] },
  { ignores: ['coverage', 'eslint.config.js', 'vite.config.ts'] },
  { 
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.eslint.json',
      },
      globals: {
        ...globals.browser,
        it: 'readonly',
        expect: 'readonly',
        React: true
      },
    },
    settings: {
      react: {
        version: '18.3.1',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'simple-import-sort': simpleImportSort,
      import: pluginImport,
      '@typescript-eslint': pluginTs,
      tsdoc,
      prettier,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginImport.configs.recommended.rules,
      ...pluginTs.configs.recommended.rules,
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      'no-irregular-whitespace': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // ⁠ react ⁠ first, then packages starting with a character
            ['^react$', '^[a-z]'],
            // Packages starting with ⁠ @
            ['^@'],
            // Imports starting with ⁠ ../ ⁠
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Imports starting with ⁠ ./ ⁠
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ],
        },
      ],
      'react-hooks/exhaustive-deps': 'off',
      'max-len': ['error', { code: 80 }],
      'import/no-unresolved': 'off',
      'import/namespace': 'off',
      'import/export': 'off',
      'import/default': 'off',
      'no-undef': 'error',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'prefer-arrow-callback': ['error'],
      'func-style': ['error', 'expression'],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          arrowParens: 'avoid',
          printWidth: 80,
          traillingComma: 'all',
        },
      ],
      'tsdoc/syntax': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports' },
      ]
    },
  },
];
