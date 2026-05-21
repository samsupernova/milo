import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // Use node environment instead of jsdom to avoid loading React/CSS
    globals: true,
  },
});
