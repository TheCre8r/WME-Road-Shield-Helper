import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf-8"));

const banner =
  "// ==UserScript==\n" +
  "// @name         WME Road Shield Helper\n" +
  "// @namespace    https://github.com/thecre8r/\n" +
  `// @version      ${pkg.version}\n` +
  "// @description  Road Shield Helper\n" +
  "// @match        https://www.waze.com/editor*\n" +
  "// @match        https://www.waze.com/*/editor*\n" +
  "// @match        https://beta.waze.com/editor*\n" +
  "// @match        https://beta.waze.com/*/editor*\n" +
  "// @exclude      https://www.waze.com/user/*\n" +
  "// @exclude      https://www.waze.com/dashboard/*\n" +
  "// @grant        GM_xmlhttpRequest\n" +
  "// @connect      raw.githubusercontent.com\n" +
  "// @author       The_Cre8r\n" +
  "// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js\n" +
  "// ==/UserScript==\n\n" +
  "/* global $ */\n" +
  "/* global W */\n" +
  "/* global WazeWrap */\n" +
  "/* global I18n */\n\n";

await esbuild.build({
  entryPoints: [path.join(root, "src/index.ts")],
  bundle: true,
  format: "iife",
  target: "es2020",
  platform: "browser",
  outfile: path.join(root, "dist", "WME-Road-Shields-Helper.user.js"),
  banner: { js: banner },
  sourcemap: false,
  minify: false,
});
