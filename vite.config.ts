/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // This will expose all of the API's method from Vite into the project
    // This helps to avoid globals imports (describe, test, expect)
    globals: true,
    environment: 'jsdom',
    // This file will run at the beginning of every test run
    setupFiles: ['/src/testsSetup.ts'],
  },
});
