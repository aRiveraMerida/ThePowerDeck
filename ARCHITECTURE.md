# Arquitectura — thePower Deck Builder

Documento de las decisiones de arquitectura del proyecto y de cómo levantarlo. Para el manual de
uso (catálogo de tipos, exportación, atajos) ver `README.md`.

---

## 1. Qué es

Una aplicación web que genera presentaciones HTML 16:9 con el sistema visual de thePower. El equipo
edita el deck en un panel, previsualiza y **descarga el entregable** (HTML interactivo o PPTX)
que luego se hace llegar al cliente. La app corre **entera en el navegador**.

---

## 2. Decisiones de arquitectura (y por qué)

### 2.1 Vanilla JS, sin framework, sin bundler
No hay React, Vue, Vite ni webpack. El "build" no transpila: solo **ensambla texto**.
- *Por qué:* la herramienta debe durar años sin mantenimiento de dependencias y desplegarse como un
  archivo estático. Cero superficie de fallo por versiones de framework. Lo que se escribe es lo que
  corre en el navegador, sin capa intermedia.

### 2.2 Runtime 100% navegador
Sin backend, sin serverless, sin base de datos. El estado vive en memoria y en `localStorage`. Las
únicas peticiones externas en runtime son a CDN (las dos librerías de export PPTX, solo al exportar)
y al logo.
- *Por qué:* requisito del proyecto. Despliegue trivial, nada que mantener en servidor, y el trabajo
  del usuario no sale de su navegador.

### 2.3 Un único `dist/index.html` autónomo
Todo —CSS, JS, el motor del deck, los 64 tipos, la lógica de edición— va embebido en un solo archivo.
- *Por qué:* portabilidad máxima. El deck exportado es también un archivo único que el cliente abre
  sin instalar nada.

### 2.4 El motor del deck es `template.html`, embebido como constante `TPL`
El "motor de presentación" (lienzo 16:9, escalado por *container queries*, paleta y tipografías de
marca, animaciones, HUD y navegación ← →) vive aislado en `src/template.html`. En el build se
serializa a una cadena JS (`TPL`). En runtime, `buildDoc(escenasHTML, n)` toma `TPL`, sustituye los
marcadores de runtime y produce el deck final.
- *Por qué:* separa el motor visual (estable) de la lógica de edición (la app). **El mismo motor
  produce el preview, el HTML exportado y el PPTX** — una sola fuente de verdad visual.

### 2.5 Fuentes separadas en `src/` + `build.mjs`
El proyecto se edita por piezas en `src/`; `build.mjs` (Node, sin dependencias) las funde en
`dist/index.html`. Antes era un monolito sincronizado a mano y un bug podía tardar en aflorar.
- *Por qué Node:* para que **Vercel ejecute el build de forma nativa** en cada push, sin Python ni
  toolchain extra. (Los tests sí son Python; ver 2.8.)

### 2.6 Registro declarativo de tipos (`registry.js`)
Cada tipo de slide es un objeto: `{ label, group, fields, sample, render }`.
- `fields` define el formulario de edición (texto, lista, selector, color, rango, icono, imagen…).
- `render(data)` devuelve el HTML de la escena.
- `sample` es el contenido de ejemplo de la galería.

Añadir un tipo = añadir un objeto. No se toca ni el motor ni la app.

### 2.7 Saneo por whitelist (`esc`)
Escapa todo el input y luego restaura una lista blanca de etiquetas de formato seguras
(`b`, `strong`, `i`, `em`, `small`, `sup`, `sub`, `u`, `br`, `span` con `class`/`style` filtrados).
- *Por qué:* los títulos permiten HTML intencional (acento de color, cursiva) pero el input nunca
  debe poder inyectar `<script>`, `onerror`, `url(javascript:)` ni similares.

### 2.8 Exportación, toda en cliente
| Formato | Técnica | Calidad |
|---|---|---|
| HTML | `buildDoc` → string → descarga | interactivo, autónomo |
| PPTX | cada slide rasterizada con `html2canvas` → imagen *full-bleed* en `PptxGenJS` | imagen fiel (no editable como texto) |

- *Por qué así:* el PPTX como imagen es la única vía fiel a las *container queries* y gradientes en
  cliente puro. Sus librerías se cargan de CDN bajo demanda (solo al exportar). El HTML es el formato
  nativo y autónomo.

### 2.9 Tests unificados en Node, con autovalidación en el build
Un único toolchain (Node), el mismo que el build:
- **`tests/smoke.mjs`** — Node puro, sin dependencias. Evalúa `registry.js` (autónomo: sus render()
  solo usan `esc`/`ic` y no tocan el DOM) y comprueba que los 64 tipos renderizan y que el saneo
  funciona, en ~250 ms. **Se ejecuta dentro de `npm run build`**, así que un catálogo roto aborta el
  build y, por tanto, el deploy.
- **`tests/functional.spec.mjs`** — `@playwright/test`. Carga sin errores, exportación,
  `localStorage` y navegación.
- **`tests/visual.spec.mjs`** — `@playwright/test` con `toHaveScreenshot`. **Regresión visual con
  baseline**: compara cada tipo (63; el `video` se excluye por ser un embed externo no determinista)
  contra una captura de referencia local (no versionada; se genera la primera vez). Detecta cambios de layout, color y tipografía, no
  solo presencia. Umbral `maxDiffPixelRatio: 0.002` (validado: deja pasar el ruido sub-pixel pero
  caza un cambio de palabra en un título). Regenerar baseline: `npm run test:visual:update`.

- *Por qué así:* el smoke es la red rápida que impide publicar un catálogo roto sin navegador (corre
  automáticamente en cada build, también en Vercel); la suite Playwright valida comportamiento y
  aspecto y se ejecuta en local antes de desplegar. Un solo entorno (Node) para todo el equipo.

---

## 3. Anatomía del runtime

```
estado: { deck (slides), brand, sel }
   │   edición en el panel según los `fields` del tipo
   ▼
renderPreview()  →  sceneHTML(slide activa)  →  iframe de preview
   │
   ▼  al exportar:
buildDoc(escenas, n)  →  sustituye TPL (<!--SCENES-->, __TOT__)  →  deck HTML completo
   ├── HTML : descarga directa del string
   └── PPTX : renderSlidePNG() con html2canvas × n slides → PptxGenJS
```

`localStorage` persiste el deck y la marca entre sesiones. Undo/redo es una pila en memoria
(no persiste entre recargas — ver TODO).

---

## 4. El pipeline de build

```
src/template.html ──(JSON.stringify, escapa </script>)──►  const TPL = "..."
src/icons.txt    ──(sustituye __ICONS__)──►  registry.js
src/registry.js  ┐
src/app.js       ┴─────────────────────────────┐
                                                ▼
src/shell.html  (marcador __APP_JS__)  ◄── TPL + registry + app  ──►  dist/index.html
```

**Dos clases de marcador, no confundir:**
- **De build** — `__APP_JS__`, `__ICONS__`: los resuelve `build.mjs`. Si quedan en la salida, el
  build falla.
- **De runtime** — `<!--SCENES-->`, `__TOT__`: viajan **a propósito** dentro de `TPL` y los resuelve
  `buildDoc()` en el navegador con el contenido de cada escena y el número de slides.

`build.mjs` además verifica que la salida tenga exactamente un `</script>` y ningún marcador de build
sin resolver; si algo no cuadra, aborta con código de error. `npm run build` encadena después el
`smoke` (`node tests/smoke.mjs`), que evalúa el catálogo en Node y aborta el build si algún tipo no
renderiza. En Vercel, un build que falla es un deploy que no ocurre.

---

## 5. Cómo levantar el proyecto

### Requisitos
- **Node ≥ 18** para construir y para el `smoke` (sin dependencias que instalar).
- Para el `e2e` (navegador): `npm install` (trae Playwright) + `npx playwright install chromium`.

### Pasos

```bash
# 1. construir el artefacto y validar el catálogo (build + smoke, todo Node)
npm run build            # node build.mjs && node tests/smoke.mjs  →  genera dist/index.html

# 2. abrirlo
#    opción A: abrir dist/index.html directamente en el navegador
#    opción B (recomendada, simula Vercel): servirlo por HTTP
cd dist && python3 -m http.server 8000   # → http://localhost:8000  (cualquier servidor estático vale)

# 3. validación profunda con navegador (local, antes de desplegar)
npm run test:e2e         # Playwright: funcional + regresión visual con baseline
# npm run test:visual:update   # regenerar baseline tras un cambio visual intencionado
```

### Iterar
Editar en `src/` (un tipo → `registry.js`; el motor → `template.html`; la UI → `app.js`), volver a
`npm run build` y revisar. **Nunca editar `dist/index.html` a mano**: es un artefacto generado.

### Desplegar en Vercel
Push del repo a GitHub → importar en Vercel → preset **Other**. La configuración ya está en
`vercel.json`: `installCommand: npm install --omit=dev` (no instala Playwright, así el build es
ligero y no descarga navegadores), `buildCommand: npm run build` (regenera `dist/index.html` **y** corre
el smoke), `outputDirectory: "dist"` (sirve **solo** el artefacto; `src/` y `tests/` no se exponen).
En cada push Vercel reconstruye desde `src/` y, si el smoke falla, **el deploy no ocurre**. No hay
nada corriendo en el servidor.

---

## 6. Límites conocidos

Documentados como tareas en la sección **TODO / Pendientes** del `README.md`. Los de mayor impacto
para el caso de uso real (el entregable descargado debe viajar completo):

- El logo de thePower aún se carga de una URL externa; conviene embeberlo en base64 en el build.
- El PPTX depende de CDN al exportar (no afecta al archivo que recibe el cliente).
- La regresión visual excluye el tipo `video` (embed externo no determinista); su funcionamiento se
  cubre en el smoke y en `functional.spec.mjs`.
