// visual.spec.mjs — regresión visual con baseline. Un test por tipo de slide: renderiza con las
// animaciones desactivadas y compara el lienzo contra una captura de referencia (toHaveScreenshot).
// Detecta cambios de layout/color/tipografía, no solo "está vacío".
//
// Baseline: tests/visual.spec.mjs-snapshots/  (commiteado, generado en Linux/CI).
// Regenerar tras un cambio visual intencionado:  npm run test:visual:update
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = pathToFileURL(join(ROOT, "index.html")).href;
const NOANIM =
  "<style>*{animation:none!important;transition:none!important}.reveal,.drawin{opacity:1!important;transform:none!important}</style>";

// los ids se obtienen del registry en Node (sin navegador) para poder declarar los tests en carga
const icons = readFileSync(join(ROOT, "src", "icons.txt"), "utf8").trim();
const registrySrc = readFileSync(join(ROOT, "src", "registry.js"), "utf8").replaceAll("__ICONS__", icons);
const { TYPES } = new Function(`${registrySrc}\n; return { TYPES };`)();
// 'video' se excluye: es un iframe externo (Vimeo) cuyo contenido no es determinista entre
// capturas, así que no sirve como baseline visual. Su correcto funcionamiento (presencia del
// embed) se valida en functional.spec.mjs / smoke.
const ids = Object.keys(TYPES).filter((id) => id !== "video");

for (const id of ids) {
  test(`slide: ${id}`, async ({ page }) => {
    await page.goto(INDEX);
    let doc = await page.evaluate((id) => buildDoc(TYPES[id].render(TYPES[id].sample), 1), id);
    doc = doc.replace("</head>", NOANIM + "</head>");
    await page.setContent(doc, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await page.waitForTimeout(300);
    await expect(page.locator(".slide")).toHaveScreenshot(`${id}.png`);
  });
}
