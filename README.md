# thePower · Deck Builder

Editor visual para construir decks horizontales 16:9 con el sistema visual thePower.
Eliges el tipo de slide, rellenas el contenido, ves el preview real y exportas el deck
completo navegable o slides sueltas. Sin build, sin dependencias.

## Uso local
Ejecuta `npm run build` y abre `dist/index.html` en el navegador.
(`dist/` es un artefacto generado; no está versionado.)

- **Izquierda · Añadir slide**: 64 tipos en 5 grupos (Estructura · Contenido · Datos ·
  Diagramas · Media). Click = añadir.
- **Centro · Preview 16:9 en vivo**: es el motor real — lo que ves es lo que exportas.
- **Derecha · Editor**: formulario de la slide. En los títulos puedes usar
  `<span class="acc">…</span>` para el acento. Listas e ítems se añaden/quitan; los iconos
  se eligen con el selector visual.
- **Abajo · Filmstrip**: click para seleccionar, × para borrar, **arrastra para reordenar**.
- **Galería con micro-previews**: cada tipo muestra un **wireframe esquemático** de su layout,
  así se distingue de un vistazo (barras vs. donut vs. dos columnas vs. tabla…).
- **Galería colapsable + buscador**: los tipos se agrupan en acordeones por categoría
  (compactos por defecto, se recuerda qué dejas abierto). El **buscador** filtra en vivo por
  nombre y descripción, con resaltado. Adiós al scroll infinito.
- **Controles sin fricción**: los porcentajes se ajustan con **sliders** y los colores con
  **swatches visuales** (no desplegables). Los iconos, con selector visual.
- **Cabecera**:
  - **🎨 Marca**: panel para cambiar **colores** (acento, secundario, fondo, texto),
    **tipografía** (6 parejas de Google Fonts) y **logos** (logo principal + coibranding
    con logo de cliente por URL, archivo subido o texto). Todo se previsualiza al instante.
  - **Tema**: thePower (oscuro) / editorial (claro, serif Fraunces).
  - **Previsualizar**: abre el deck completo en una pestaña.
  - **Slide**: exporta solo la seleccionada. **Descargar deck**: todas, navegable con ← →.

El deck y la marca se autoguardan en el navegador (localStorage).

## Variantes y elementos extra (en toda slide)

Cada slide tiene una sección plegable **"Variantes y elementos extra"** al final del editor.
Aplica a las 64 — multiplica las composiciones sin crear tipos nuevos:

- **Invertir disposición**: voltea las slides de dos columnas (dos columnas, comparativa,
  pros/contras, cita con retrato, dato+cuerpo).
- **Imagen de fondo**: convierte cualquier slide en su versión "con foto" (con overlay para
  legibilidad y la misma optimización WebP). Una portada, un cierre o una frase sobre imagen.
- **Badge de esquina**: etiqueta tipo "CONFIDENCIAL", "NUEVO"… en cualquiera de las 4 esquinas.
- **Pie / fuente**: texto pequeño abajo.
- **Etiqueta lateral**: texto vertical en el lateral (p.ej. cliente · año).
- **Watermark**: texto de fondo difuminado.

## Exportación (menú **Exportar ▾**)

- **HTML interactivo**: el deck navegable en un solo archivo (← →, pantalla completa). Autónomo,
  se abre en cualquier navegador y se despliega en Vercel.
- **PowerPoint (.pptx)**: cada slide como **imagen de alta resolución** (2×), fiel al diseño
  (gradientes, tipografías, gráficos). Carga las librerías solo al usarlo. El resultado se ve
  idéntico al HTML; no es editable como texto en PowerPoint (es imagen), pero sirve para circular
  el deck en el formato que muchos clientes piden.

## Red de seguridad y productividad

- **Deshacer / rehacer**: botones ↶ ↷ en la cabecera y atajos **Ctrl/Cmd+Z** y
  **Ctrl/Cmd+Shift+Z** (o Ctrl+Y). Hasta 80 pasos de historial. Un borrado ya no es definitivo.
- **Guardar / abrir proyecto**: **Guardar** descarga el proyecto editable como `.tpdeck.json`
  (deck + marca); **Abrir** lo recupera. Esto es independiente del autoguardado en el navegador,
  así que puedes cambiar de equipo o hacer copias. *(Distinto de "Descargar deck", que exporta
  el HTML final para presentar.)*
- **Plantillas de partida**: botón **⊞ Plantillas** con cuatro decks listos
  (Propuesta comercial · Keynote · Resultados/QBR · Programa de formación). No empiezas en blanco.
- **Aviso de contraste**: el panel de Marca comprueba el contraste WCAG de texto/fondo y
  acento/fondo y avisa si baja del mínimo legible, para que un cambio de color no rompa la lectura.
- **Límites de composición**: cada tipo tiene un máximo razonable de elementos (p.ej. 4 KPIs,
  6 celdas de bento, 6 nodos de ciclo). Al alcanzarlo, el botón de añadir se desactiva — así no
  se descuadra la slide.
- **Texto seguro**: el contenido se sanea antes de renderizar. Puedes escribir `<` o `&`
  literales (p.ej. "Coste < 100 € & extras") sin romper el deck, y el formato intencional
  (`<b>`, `<small>`, `<span class="acc">`) se respeta. Bloquea inyección de scripts en el HTML
  exportado.

## Catálogo de tipos (64)

- **Estructura**: Portada · Frase única · Divisor de sección · Agenda · Cita · Cita con retrato · Cierre / CTA · Capítulo / banda · **Portada con imagen** · **Índice con progreso** · **Gracias / contacto**
- **Contenido**: Tarjetas · Capacidades (iconos) · Dos columnas · Pasos · Capas · Preguntas ·
  Bullets · Callout · Nota destacada · Rejilla bento · Equipo/personas · Pros y contras ·
  Checklist · Muro de logos · Tres columnas
- **Datos**: Cifras · KPIs · Tabla · Comparativa antes/ahora · Cambios · Secuencia · Flujo ·
  Número héroe · Barras verticales · Comparativa ✓/✗ · Tarifas/planes · Barras de progreso ·
  Gráfico de línea · Dato + cuerpo · **Barras apiladas** · **Gráfico de área** · **Cascada (waterfall)**
- **Diagramas**: Pirámide · Donuts · Medidor · Barras · Roadmap (timeline) · Embudo · Stack ·
  Venn · Matriz 2×2 · Proceso circular · Cronología vertical · **Organigrama** · **Carriles (swimlane)** · **Gantt**
- **Media**: Imagen a sangre · Imagen + texto · Vídeo (YouTube/Vimeo/MP4) · Galería de imágenes · **Mockup de dispositivo** · **Comparador (antes/después)** · **Dato sobre imagen**

### Imágenes — subir con optimización
- **Subir y optimizar**: cualquier imagen se **redimensiona a 1920px y se comprime en WebP**
  antes de incrustarse. Una foto de 3 MB pasa a ~100-200 KB. El deck exportado es **autónomo
  y ligero**. También puedes pegar una **URL directa**.
- **Medidor de peso**: la cabecera muestra el peso total de las imágenes embebidas (`⛁ … KB`).

### Vídeo
- **YouTube / Vimeo / MP4**. Vimeo y YouTube se convierten a embed automáticamente.
- **Modo fondo**: el vídeo ocupa la slide a sangre, en bucle y silenciado (Vimeo `background`),
  ideal para portadas con vídeo. O **modo reproductor** con controles.

### Animación
- **Ken Burns** (zoom lento) opcional en imagen a sangre e imagen+texto.
- **Transición de entrada** suave entre slides en el deck exportado.
- Respeta `prefers-reduced-motion`.

### Iconos
33 iconos SVG (estilo lucide) con **selector visual** dentro de Tarjetas, Capacidades y Flujo.

## Desplegar en Vercel

El runtime es **100% navegador**: no hay backend, ni serverless, ni `api/`. Vercel construye
`dist/index.html` (build step, en Node) y sirve **solo** la carpeta `dist/` como estático, de modo
que `src/` y `tests/` no quedan expuestos en la URL pública. Las únicas peticiones externas en
runtime son a CDN (las librerías de export PPTX, solo al exportar) y al logo.

La configuración ya está en `vercel.json` (`buildCommand: npm run build`, `outputDirectory: "dist"`)
y `package.json` (`npm run build`). Caminos:

**Git (recomendado)**: sube la carpeta a GitHub → impórtala en Vercel → Framework preset **Other**.
En cada push, Vercel ejecuta `npm run build` (regenera `dist/index.html` desde `src/`) y despliega
solo `dist/`. El artefacto no se versiona.

**CLI**: `npm i -g vercel && cd ThePowerDeck && vercel --prod`.

**Drag & drop**: ejecuta `npm run build` en local y arrastra la carpeta `dist/` a vercel.com.

No hay nada que correr en el servidor: el despliegue es un archivo estático servido por CDN.

## Extender: añadir un tipo nuevo

El catálogo vive en el objeto `TYPES`, en **`src/registry.js`** (no edites `dist/index.html`: es un
artefacto generado). Tras editar, ejecuta `node build.mjs` (o `npm run build`) para regenerar `dist/index.html`.

```js
miTipo:{
  label:'Nombre', group:'Contenido', desc:'descripción corta',
  fields:[ {k:'title', l:'Titular', t:'area'},
           {k:'items', l:'Items', t:'items', sub:[{k:'t',l:'Título',t:'text'},{k:'icon',l:'Icono',t:'icon'}]} ],
  sample:{ title:'…', items:[...] },
  render:d=>`<section class="scene">…${d.title}…</section>`
}
```

Tipos de campo (`t`): `text` · `area` · `list` · `items` (objetos repetibles con `sub`) ·
`sel` (desplegable) · `swatch` (color visual) · `range` (slider, con `min`/`max`/`def`) ·
`icon` (selector de iconos) · `img` (imagen en lista, optimizada) · `media` (campo media con `kind`).

## Desarrollo

El proyecto se edita por **fuentes separadas** en `src/` y se ensambla en un único
`dist/index.html` desplegable con `build.mjs`. No se edita el artefacto a mano.

```
ThePowerDeck/
├── dist/index.html   ← GENERADO por build.mjs (lo que se despliega; no versionado)
├── build.mjs         ← ensambla src/ → dist/index.html (Node, sin dependencias; lo corre Vercel)
├── package.json      ← scripts: build (build+smoke), test, test:e2e, test:visual:update
├── playwright.config.mjs
├── vercel.json
├── src/
│   ├── template.html ← motor del deck (16:9, escalado por container queries, marca, animaciones)
│   ├── icons.txt     ← IDs de iconos disponibles (se inyectan en el registry)
│   ├── registry.js   ← los 64 tipos de slide (cada uno: label, group, fields, sample, render)
│   ├── app.js        ← lógica del builder: estado, edición, historial, marca, export, glyphs
│   └── shell.html    ← marco HTML de la app (recibe todo lo anterior)
└── tests/
    ├── smoke.mjs                  ← catálogo en Node puro (sin navegador). Corre dentro del build
    ├── functional.spec.mjs        ← Playwright: carga, export, localStorage, navegación
    ├── visual.spec.mjs            ← Playwright: regresión visual con baseline de 51 tipos
    (visual.spec.mjs-snapshots/ ← baseline local, se genera con npm run test:visual:update)
```

**Un solo toolchain: Node.** El `smoke` es Node puro y corre dentro del build (un catálogo roto
**aborta el deploy**). Los tests con navegador (`functional` + `visual`) usan `@playwright/test`
y corren en local antes de desplegar. La **regresión visual** compara cada slide contra una captura de
referencia: detecta cambios de layout, color y tipografía, no solo "está vacío".

**Flujo de iteración**

```bash
# 1. editar lo que toque en src/  (un tipo → registry.js; el motor → template.html; la UI → app.js)
npm run build               # 2. regenera dist/index.html y valida el catálogo (build + smoke)
npm run test:e2e            # 3. funcional + regresión visual con navegador
```

Si un cambio visual es **intencionado** (rediseñas un tipo, ajustas la marca), el test visual
fallará hasta que actualices la referencia:

```bash
npm run test:visual:update  # regenera las capturas baseline tras un cambio visual deliberado
```

`build.mjs` serializa `template.html` a una constante JS, inyecta los iconos en el registry y
funde registry + app dentro de `shell.html`. Valida que no queden marcadores de build sin resolver
y que haya exactamente un `</script>`. `npm run build` encadena el `smoke`, que evalúa el catálogo
en Node y aborta si algún tipo no renderiza o el saneo falla.

**Antes de desplegar.** El `smoke` corre dentro de `npm run build`, así que el catálogo siempre se
valida al construir (también en Vercel: un catálogo roto aborta el deploy). Los tests con navegador
(`npm run test:e2e`) se ejecutan en local antes de hacer push — conviene pasarlos cuando toques
`app.js`, `template.html` o un tipo, ya que validan layout, exportación y persistencia que el smoke
no cubre.

> La regresión visual compara contra capturas de referencia (*baseline*) que **no se incluyen en el
> repo**: dependen del SO (render de fuentes), así que cada uno genera las suyas la primera vez con
> `npm run test:visual:update`. A partir de ahí, `npm run test:e2e` detecta cualquier cambio visual.
> Para un baseline reproducible entre máquinas, genéralo dentro del contenedor oficial de Playwright
> (`mcr.microsoft.com/playwright`).

**Requisitos**
- **Node ≥ 18** para construir y para el `smoke` (sin dependencias que instalar).
- Para los tests con navegador: `npm install` + `npx playwright install chromium`.

**Marcadores de runtime** (no tocar): dentro de la constante `TPL` viajan `<!--SCENES-->` y
`__TOT__`; los resuelve `buildDoc()` en el navegador con el contenido de cada escena y el nº de
slides. No son marcadores de build.

**Relación con la skill `thepower-deck`**: `src/template.html` es la copia autónoma del motor para
esta app. La skill sigue su propia vida; si mejoras un componente allí y lo quieres aquí, copia el
cambio a `src/template.html` y vuelve a construir.

## TODO / Pendientes

Priorizados para el contexto de uso real: **el equipo de thePower genera y descarga el deck; el
cliente recibe el archivo**. Lo importante es que el archivo descargado viaje completo.

### Alta — entregable autónomo
- [ ] **Embeber el logo de thePower en base64 (build-time).** Hoy el deck referencia el logo en
  `dondeestudiar.eu`, cuyo servidor responde con captcha anti-bot; si el HTML se abre sin red o el
  dominio falla, el deck aparece sin marca. Plan: `src/logo.txt` con el dataURL + marcador `__LOGO__`
  que `build.mjs` inyecta en `template.html` y `app.js`. **Requiere el PNG/SVG oficial del logo.**
- [ ] **Forzar dataURL en toda imagen de marca.** Si en el panel de marca se *pega una URL* de logo
  de cliente (en vez de subir el archivo), el deck vuelve a depender de un servidor externo. Convertir
  a base64 también al pegar, no solo al subir.

### Media
- [ ] **PPTX sin CDN.** `html2canvas` y `PptxGenJS` se cargan de jsdelivr al exportar; si la red
  interna bloquea CDN, la exportación PPTX falla. Empaquetar ambas inline en el build (~600 KB) deja
  la herramienta autónoma. (No afecta al cliente: él recibe el `.pptx` ya generado.)
- [ ] **Fuentes Google embebidas (opcional).** Solo si se entregan decks pensados para abrirse sin
  conexión. Hoy degradan a la tipografía del sistema; embeberlas añade ~1–2 MB al archivo.

> Hecho: el build se autovalida con un *smoke* en Node (`tests/smoke.mjs`) que corre dentro de
> `npm run build`; un catálogo roto aborta el deploy. Tests unificados en Node (smoke + Playwright),
> sin Python. **Regresión visual con baseline** (`tests/visual.spec.mjs`, 51 tipos) que detecta
> cambios de layout/color/tipografía.

### Baja / futuro
- [ ] **Plantillas con copy real de thePower.** Las 4 actuales son andamiaje; poblarlas con la
  estructura comercial real (portada → diagnóstico → programa → precio → cierre).
- [ ] **Persistir el historial de undo/redo** entre recargas (hoy se pierde al refrescar).
- [ ] **Notas de orador / modo presentador** en el deck exportado.
- [x] **Servir solo el artefacto en Vercel.** `build.mjs` emite a `dist/` y `outputDirectory: "dist"`,
  de modo que `src/` y `tests/` ya no quedan expuestos en la URL pública.
