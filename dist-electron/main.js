import { app as n, BrowserWindow as t } from "electron";
import { fileURLToPath as a } from "node:url";
import o from "node:path";
const s = o.dirname(a(import.meta.url));
process.env.APP_ROOT = o.join(s, "..");
const i = process.env.VITE_DEV_SERVER_URL, m = o.join(process.env.APP_ROOT, "dist-electron"), r = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = i ? o.join(process.env.APP_ROOT, "public") : r;
let e;
function c() {
  e = new t({
    icon: o.join(process.env.VITE_PUBLIC, "icons/vmc.png"),
    width: 700,
    height: 580,
    minWidth: 600,
    minHeight: 580,
    maxHeight: 580,
    webPreferences: {
      preload: o.join(s, "preload.mjs")
    }
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), i ? e.loadURL(i) : e.loadFile(o.join(r, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  t.getAllWindows().length === 0 && c();
});
n.whenReady().then(c);
export {
  m as MAIN_DIST,
  r as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
