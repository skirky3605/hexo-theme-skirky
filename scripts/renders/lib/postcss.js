const { parse } = require("path");
const postcss = require("postcss");
const cssnano = require("cssnano");
const postcssPresetEnv = require("postcss-preset-env");
const postcssHtml = require("postcss-html");
const { minify } = require("html-minifier-terser");

const browsers = ["IE >= 1", "Firefox >= 1", "Chrome >= 1", "Safari >= 1", "Opera >= 1"];
const plugins = [
  postcssPresetEnv({ stage: 0, browsers }),
  cssnano({ preset: "advanced" })
];

/**
 * @param {string} str
 * @param {{ path: string }} data
 * @this {import("@types/hexo")}
 */
async function processCSS(str, data) {
  if (!str) { return str; }
  const path = data.path;
  try {
    const base = path ? parse(path).base : "temp.css";
    const result = await postcss(plugins).process(str, { from: base, to: base });
    return result.css;
  }
  catch (err) {
    throw new Error(`Path: ${path}\n${err}`);
  }
}

/**
 * @param {import("@types/hexo")} hexo
 * @param {string} str
 */
async function terser(hexo, str) {
  const options = hexo.theme.config.terser.html;
  if (!str) { return str; }
  return minify(str, {
    ignoreCustomComments: [/^\s*more/],
    ...options
  });
}

/**
 * @param {string} str
 * @param {{ path: string }} data
 * @this {import("@types/hexo")}
 */
async function processHTMLCSS(str, data) {
  if (!str) { return str; }
  const path = data.path;
  try {
    const base = path ? parse(path).base : "temp.html";
    const result = await postcss(plugins).process(str, { from: base, to: base, syntax: postcssHtml() });
    return terser(this, result.content);
  }
  catch (err) {
    throw new Error(`Path: ${path}\n${err}`);
  }
}

module.exports = {
  processCSS,
  processHTMLCSS
}