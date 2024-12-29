"use strict";

const fs = require("fs");
const { resolve } = require("./utils");

/** @type {import("@adobe/css-tools")} */
let css;
try {
  css = require("@adobe/css-tools");
} catch {
  css = require("css");
}

/**
 * @param {string} name
 */
function highlightTheme(name) {
  const file = resolve("highlight.js", `styles/${name}.css`);
  const content = fs.readFileSync(file, "utf8");

  let background = '';
  let foreground = '';

  const style = css.parse(content);
  const rules = style.stylesheet.rules;

  for (const rule of rules) {
    if (rule.type === "rule") {
      const selectors = rule.selectors;
      if (selectors.some(selector => selector.endsWith(".hljs"))) {
        for (const declaration of rule.declarations) {
          if (declaration.property === "background" || declaration.property === "background-color") {
            background = declaration.value;
          }
          else if (declaration.property === "color") {
            foreground = declaration.value;
          }
        }
      }
      /** @type {string[]} */
      const result = [];
      for (const selector of selectors) {
        if (selector.includes(".hljs-")) {
          result.push(`.code .line ${selector.replaceAll("hljs-", '')}`);
        }
      }
      selectors.push(...result);
    }
    else if (rule.type === "media") {
      for (const inner of rule.rules) {
        if (inner.type === "rule") {
          const selectors = inner.selectors;
          /** @type {string[]} */
          const result = [];
          for (const selector of selectors) {
            if (selector.includes(".hljs-")) {
              result.push(`.code .line ${selector.replaceAll("hljs-", '')}`);
            }
          }
          selectors.push(...result);
        }
      }
    }
  }

  return {
    style: css.stringify(style),
    background,
    foreground
  };
}

/**
 * @param {string} light
 * @param {string} dark
 */
const createHighlight = (light, dark) => `${light}

@media (prefers-color-scheme: dark) {
  ${dark}
}`

module.exports =
  /** @param {import("@types/hexo")} hexo */ hexo => {
    const theme = hexo.theme.config;
    hexo.config.highlight.hljs = false;
    const light = highlightTheme(theme.codeblock.theme.light);
    const dark = highlightTheme(theme.codeblock.theme.dark);
    theme.highlight = { light, dark };
    hexo.extend.generator.register("highlight_generator", () => {
      return {
        path: `${hexo.theme.config.css}/highlight.css`,
        data: () => {
          return hexo.render.render({ text: createHighlight(light.style, dark.style), engine: "css" });
        }
      }
    });
  };
