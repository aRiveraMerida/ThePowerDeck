#!/usr/bin/env node
/*
 * smoke.mjs — validación funcional rápida del catálogo, en Node puro (sin navegador, sin deps).
 *
 * Es posible porque `src/registry.js` es autónomo: sus render() solo usan helpers definidos en el
 * propio fichero (esc, ic) y no tocan el DOM. Eso permite evaluarlo en Node y comprobar que todos
 * los tipos renderizan y que el saneo funciona — en milisegundos.
 *
 * Corre dentro del build (`npm run build`), de modo que un fallo aquí ABORTA el despliegue:
 * Vercel no puede publicar un catálogo roto.
 *
 * Para la validación con navegador real (layout, export, persistencia) ver tests/e2e.mjs.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const icons = readFileSync(join(SRC, "icons.txt"), "utf8").trim();
const registry = readFileSync(join(SRC, "registry.js"), "utf8").replaceAll("__ICONS__", icons);

// evaluar el registry y extraer TYPES + esc (sin DOM, sin globals del navegador)
let TYPES, esc;
try {
  ({ TYPES, esc } = new Function(`${registry}\n; return { TYPES, esc };`)());
} catch (e) {
  console.error("\u2717 El registry no evalúa en Node:", e.message);
  process.exit(1);
}

const fails = [];
const ids = Object.keys(TYPES);

// 1. nº de tipos razonable y estructura mínima
if (ids.length < 50) fails.push(`pocos tipos: ${ids.length}`);
for (const id of ids) {
  const t = TYPES[id];
  if (!t.render || !t.sample || !t.fields) fails.push(`${id}: falta render/sample/fields`);
}

// 2. render con sample → HTML de escena
for (const id of ids) {
  try {
    const h = TYPES[id].render(TYPES[id].sample);
    if (!String(h).includes("<section")) fails.push(`${id}: render(sample) sin <section`);
  } catch (e) {
    fails.push(`${id}: render(sample) lanza → ${e.message}`);
  }
}

// 3. render con datos vacíos no debe lanzar
for (const id of ids) {
  const d = {};
  (TYPES[id].fields || []).forEach((f) => { d[f.k] = (f.t === "items" || f.t === "list") ? [] : ""; });
  try {
    TYPES[id].render(d);
  } catch (e) {
    fails.push(`${id}: render(vacío) lanza → ${e.message}`);
  }
}

// 4. saneo: XSS bloqueado, formato intencional preservado
const cases = [
  ["xss script", esc("<script>alert(1)</script>"), (r) => !r.includes("<script>")],
  ["xss img onerror", esc('<img src=x onerror=alert(1)>'), (r) => !r.includes("<img")],
  ["span class+style", esc('<span class="acc" style="font-style:italic">x</span>'), (r) => r.includes('<span class="acc" style="font-style:italic">')],
  ["small", esc("73<small>%</small>"), (r) => r.includes("<small>")],
  ["literal < &", esc("Coste < 100 & más"), (r) => r.includes("&lt; 100 &amp;")],
];
for (const [name, out, ok] of cases) {
  if (!ok(out)) fails.push(`saneo ${name}: ${out}`);
}

console.log("=== SMOKE (Node, sin navegador) ===");
console.log(`tipos: ${ids.length}`);
if (fails.length) {
  for (const f of fails) console.error("\u2717", f);
  process.exit(1);
}
console.log("\u2713 catálogo y saneo OK");
