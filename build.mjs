#!/usr/bin/env node
/*
 * build.mjs — ensambla las fuentes de src/ en un único index.html desplegable.
 *
 * Sin dependencias (solo módulos nativos de Node). Lo ejecuta Vercel en el build step
 * y también sirve en local. El resultado es un único archivo estático que corre
 * 100% en el navegador (sin backend, sin serverless).
 *
 * Pipeline:
 *   1. src/template.html → constante JS `TPL` (el motor del deck).
 *   2. src/icons.txt     → se inyecta en src/registry.js (marcador __ICONS__).
 *   3. src/registry.js   → catálogo de los 52 tipos de slide.
 *   4. src/app.js        → lógica del builder (estado, edición, historial, export, glyphs).
 *   5. src/shell.html    → marco de la app; su marcador __APP_JS__ recibe TPL+registry+app.
 *
 * Uso:  node build.mjs       (o `npm run build`)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(fileURLToPath(import.meta.url));
const read = (n) => readFileSync(join(ROOT, "src", n), "utf8");

const template = read("template.html");
const icons = read("icons.txt").trim();
const registry = read("registry.js").replaceAll("__ICONS__", icons);
const app = read("app.js");
const shell = read("shell.html");

// el template viaja como string JS seguro dentro del bundle
const tplJs = JSON.stringify(template).replaceAll("</script>", "<\\/script>");
const bundle = `const TPL = ${tplJs};\n\n${registry}\n\n${app}`;
// función de reemplazo: evita que JS interprete $&, $`, $', $$ dentro del bundle
// (el código JS contiene muchos `$`, p.ej. $('id') y template literals ${...})
const out = shell.replace("__APP_JS__", () => bundle);

// integridad: solo marcadores de BUILD. __TOT__ y <!--SCENES--> son de RUNTIME
// (los resuelve buildDoc() en el navegador) y deben permanecer dentro de TPL.
const leftover = ["__APP_JS__", "__ICONS__"].filter((m) => out.includes(m));
if (leftover.length) {
  console.error("\u2717 Marcadores de build sin resolver:", leftover);
  process.exit(1);
}
const nScript = (out.match(/<\/script>/g) || []).length;
if (nScript !== 1) {
  console.error(`\u2717 Se esperaba exactamente 1 </script>, hay ${nScript}`);
  process.exit(1);
}

writeFileSync(join(ROOT, "index.html"), out);
console.log(
  `\u2713 index.html generado \u00b7 ${out.length.toLocaleString("es")} bytes \u00b7 1 </script> \u00b7 sin marcadores`
);
