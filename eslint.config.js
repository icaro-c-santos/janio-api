/**
 * THIS FILE WAS AUTO-GENERATED.
 * PLEASE DO NOT EDIT IT MANUALLY.
 * ===============================
 * IF YOU'RE COPYING THIS INTO AN ESLINT CONFIG, REMOVE THIS COMMENT BLOCK.
 */

import path from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { configs, plugins } from 'eslint-config-airbnb-extended';
import { rules as prettierConfigRules } from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export const projectRoot = path.resolve('.');
export const gitignorePath = path.resolve(projectRoot, '.gitignore');

const overrideRules = [
  {
    files: ['./src/**'],
    name: 'custom/overrides',
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['./src/**'],
    rules: {
      'no-restricted-properties': [
        2,
        {
          object: 'process',
          property: 'env',
          message:
            'Please use appConfig from src/config/index.ts to import any environment variables.',
        },
      ],
    },
  },
  {
    files: ['./src/config/envs/**', './src/config/index.ts'],
    rules: {
      'no-restricted-properties': 'off',
    },
  },
];

const jsConfig = [
  // ESLint Recommended Rules
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  // Stylistic Plugin
  plugins.stylistic,
  // Import X Plugin
  plugins.importX,
  // Airbnb Base Recommended Config
  ...configs.base.recommended,
];

const nodeConfig = [
  // Node Plugin
  plugins.node,
  // Airbnb Node Recommended Config
  ...configs.node.recommended,
];

const typescriptConfig = [
  // TypeScript ESLint Plugin
  plugins.typescriptEslint,
  // Airbnb Base TypeScript Config
  ...configs.base.typescript,
];

const prettierConfig = [
  // Prettier Plugin
  {
    name: 'prettier/plugin/config',
    plugins: {
      prettier: prettierPlugin,
    },
  },
  // Prettier Config
  {
    name: 'prettier/config',
    rules: {
      ...prettierConfigRules,
      'prettier/prettier': 'error',
    },
  },
];

export default [
  includeIgnoreFile(gitignorePath),
  ...jsConfig,
  ...nodeConfig,
  ...typescriptConfig,
  ...overrideRules,
  ...prettierConfig,
  {
    settings: {
      'import-x/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
      },
    },
  },
];
