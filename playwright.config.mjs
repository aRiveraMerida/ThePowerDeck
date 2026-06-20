import { defineConfig, devices } from "@playwright/test";

// Regresión visual: los snapshots dependen del SO (render de fuentes). El baseline canónico se
// genera en Linux (CI / contenedor), que es donde corre la GitHub Action. En macOS local verás
// diffs de plataforma; el gate de verdad es CI. Regenerar baseline: npm run test:visual:update.
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.mjs",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    viewport: { width: 1280, height: 720 },
    ...devices["Desktop Chrome"],
  },
  expect: {
    // mismo SO + fuentes cargadas → render determinista; umbral bajo detecta cambios reales
    // (texto, color, layout) tolerando solo ruido sub-pixel de antialiasing
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled" },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
