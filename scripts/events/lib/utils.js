/** Based on [`scripts/events/lib/utils.js` from hexo-theme-next](https://github.com/next-theme/hexo-theme-next/blob/master/scripts/events/lib/utils.js) **/
"use strict";

const fs = require("fs");
const path = require("path");

/** @type {{ parse: (css: string, options?: { source?: string, silent?: boolean }) => { stylesheet: { rules: { type: string, selectors: string[], declarations: { property: string, value: string}[] }[] } } }} */
let css;
try {
  css = require("@adobe/css-tools");
} catch {
  css = require("css");
}

/**
 * @param {string} name
 */
function resolve(name, file = '') {
  try {
    const dir = path.dirname(require.resolve(`${name}/package.json`));
    return `${dir}/${file}`;
  } catch {
    return '';
  }
}

/**
 * @param {string} name
 */
function highlightTheme(name) {
  const file = resolve("highlight.js", `styles/${name}.css`);
  const content = fs.readFileSync(file, "utf8");

  let background = '';
  let foreground = '';
  css.parse(content).stylesheet.rules
    .filter(rule => rule.type === "rule" && rule.selectors.some(selector => selector.endsWith(".hljs")))
    .flatMap(rule => rule.declarations)
    .forEach(declaration => {
      if (declaration.property === "background" || declaration.property === "background-color") {
        background = declaration.value;
      }
      else if (declaration.property === "color") {
        foreground = declaration.value;
      }
    });

  return {
    file,
    background,
    foreground
  };
}

/**
 * @param {import("@types/hexo")} hexo
 * @param {string} path
 * @param {string} name
 * @param {string} file
 */
function renderGeneratorAsync(hexo, path, name, file) {
  return {
    path: `${hexo.theme.config.js}/${path}`,
    data: () => hexo.render.render({ path: resolve(name, file) })
  };
}

module.exports = {
  resolve,
  highlightTheme,
  renderGeneratorAsync
};
