/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_API_PROXY_TARGET;

  return {
    plugins: [devtools(), tanstackRouter({
      target: "react",
      autoCodeSplitting: true
    }), viteReact(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    server: {
      host: "0.0.0.0",
      cors: false,
      proxy: proxyTarget
        ? {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
              rewrite: (path: string) => path.replace(/^\/api/, "")
            }
          }
        : undefined
    },
    test: {
      projects: [
        {
          // unit + component tests: 순수 함수와 컴포넌트 모두 — jsdom 환경
          extends: true,
          test: {
            name: 'unit',
            environment: 'jsdom',
            setupFiles: ['./vitest.setup.ts'],
            include: ['src/**/*.test.{ts,tsx}'],
          }
        },
        {
          extends: true,
          plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: 'playwright',
              instances: [{
                browser: 'chromium'
              }]
            }
          }
        }
      ]
    }
  };
});