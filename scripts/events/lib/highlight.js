"use strict";

const fs = require("fs");
const parse = require("postcss/lib/parse");

/**
 * @param {string} name
 */
function highlightTheme(name) {
  const file = require.resolve(`highlight.js/styles/${name}.css`);
  const content = fs.readFileSync(file, "utf8");

  let background = '';
  let foreground = '';

  const style = parse(content);

  style.walkRules(rule => {
    const selectors = rule.selectors;
    if (selectors.some(selector => selector.endsWith(".hljs"))) {
      rule.walkDecls(declaration => {
        if (declaration.prop === "background" || declaration.prop === "background-color") {
          background = declaration.value;
        }
        else if (declaration.prop === "color") {
          foreground = declaration.value;
        }
      });
    }
    /** @type {string[]} */
    const result = [];
    for (const selector of selectors) {
      if (selector.includes(".hljs-")) {
        result.push(`.code .line ${selector.replaceAll("hljs-", '')}`);
      }
    }
    rule.selectors = [...selectors, ...result];
  });

  return {
    style: style,
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
}`;

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
        data: () => hexo.render.render({ text: createHighlight(light.style, dark.style), engine: "css" })
      }
    });
  };
