// functional.spec.mjs — validación funcional con navegador real (@playwright/test).
// Cubre lo que el smoke (Node) no puede: carga real, exportación, persistencia y navegación.
import { test, expect } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = pathToFileURL(join(ROOT, "dist", "index.html")).href;

test("carga sin errores y con los 64 tipos", async ({ page }) => {
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text()); });
  await page.goto(INDEX);
  await page.waitForTimeout(500);
  const n = await page.evaluate(() => Object.keys(TYPES).length);
  expect(n).toBeGreaterThanOrEqual(64);
  expect(errs).toEqual([]);
});

test("export: el deck contiene una escena por cada tipo", async ({ page, context }) => {
  await page.goto(INDEX);
  const { html, n } = await page.evaluate(() => {
    deck = { title: "QA", theme: "", slides: Object.keys(TYPES).map((id) => ({ id: Math.random(), type: id, data: structuredClone(TYPES[id].sample) })) };
    sel = 0;
    return { html: deckDoc(), n: deck.slides.length };
  });
  const ep = await context.newPage();
  const eerr = [];
  ep.on("pageerror", (e) => eerr.push(String(e)));
  await ep.goto("data:text/html;charset=utf-8," + encodeURIComponent(html));
  await ep.waitForTimeout(700);
  const nsc = await ep.evaluate(() => document.querySelectorAll(".scene").length);
  await ep.close();
  expect(nsc).toBe(n);
  expect(eerr).toEqual([]);
});

test("localStorage: el deck persiste entre recargas", async ({ page }) => {
  await page.goto(INDEX);
  await page.evaluate(() => localStorage.removeItem("tp_deck2"));
  await page.evaluate(() => {
    deck = { title: "LS", theme: "editorial", slides: [{ id: 1, type: "cover", data: structuredClone(TYPES.cover.sample) }] };
    brand.accent = "#123456";
    save();
  });
  await page.reload();
  await page.waitForTimeout(400);
  const ls = await page.evaluate(() => ({ t: deck.title, n: deck.slides.length, a: brand.accent }));
  expect(ls).toEqual({ t: "LS", n: 1, a: "#123456" });
});

test("tema: el color de marca se renderiza por encima del preset (thePower y editorial)", async ({ page }) => {
  await page.goto(INDEX);
  await page.evaluate(() => localStorage.removeItem("tp_deck2"));
  await page.reload();
  await page.evaluate(() => addSlide("cover"));
  const accDe = async (th) => {
    await page.click(`#themeSel button[data-th="${th}"]`);
    await page.evaluate(() => {
      const i = document.getElementById("bAcc");
      i.value = "#ff0000";
      i.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(300);
    return page.evaluate(() => {
      const root = document.getElementById("preview").contentDocument.documentElement;
      return getComputedStyle(root).getPropertyValue("--acc").trim().toLowerCase();
    });
  };
  // en ambos temas, el acento elegido en el panel de marca debe ganar al preset del tema
  expect(await accDe("editorial")).toBe("#ff0000");
  expect(await accDe("")).toBe("#ff0000");
});

test("tema: cambiar de tema vuelca su paleta en la marca y se renderiza", async ({ page }) => {
  await page.goto(INDEX);
  await page.evaluate(() => localStorage.removeItem("tp_deck2"));
  await page.reload();
  await page.evaluate(() => addSlide("cover"));
  await page.click('#themeSel button[data-th="editorial"]');
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => {
    const root = document.getElementById("preview").contentDocument.documentElement;
    return { brandAcc: brand.accent.toLowerCase(), pickerAcc: document.getElementById("bAcc").value.toLowerCase(), cssAcc: getComputedStyle(root).getPropertyValue("--acc").trim().toLowerCase() };
  });
  // el preset editorial se carga en la marca, el selector lo refleja y el preview lo pinta
  expect(r.brandAcc).toBe("#c8f04a");
  expect(r.pickerAcc).toBe("#c8f04a");
  expect(r.cssAcc).toBe("#c8f04a");
});

test("navegación del deck exportado (← →)", async ({ page, context }) => {
  await page.goto(INDEX);
  const dh = await page.evaluate(() => {
    deck = { title: "n", theme: "", slides: ["cover", "kpi", "quote"].map((t) => ({ id: Math.random(), type: t, data: structuredClone(TYPES[t].sample) })) };
    return deckDoc();
  });
  const np = await context.newPage();
  await np.goto("data:text/html;charset=utf-8," + encodeURIComponent(dh));
  await np.waitForTimeout(500);
  expect(await np.evaluate(() => document.querySelector("#cur")?.textContent)).toBe("01");
  await np.keyboard.press("ArrowRight");
  await np.waitForTimeout(250);
  expect(await np.evaluate(() => document.querySelector("#cur")?.textContent)).toBe("02");
  expect(await np.evaluate(() => document.querySelectorAll(".scene.active").length)).toBe(1);
  await np.close();
});
