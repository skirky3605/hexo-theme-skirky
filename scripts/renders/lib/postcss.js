const { parse } = require("path");
const postcss = require("postcss");
const postcssPresetEnv = require("postcss-preset-env");
const postcssHtml = require("postcss-html");

const browsers = ["IE >= 1", "Firefox >= 1", "Chrome >= 1", "Safari >= 1", "Opera >= 1"];

/**
 * @param {string} str
 * @param {{ path: string }} data
 * @this {import('@types/hexo')}
 */
async function processCSS(str, data) {
  if (!str) { return str; }
  const path = data.path;
  try {
    const base = path ? parse(path).base : "temp.css";
    const result = await postcss([postcssPresetEnv({ stage: 0, browsers })]).process(str, { from: base, to: base });
    return result.css;
  }
  catch (err) {
    throw new Error(`Path: ${path}\n${err}`);
  }
}

/**
 * @param {string} str
 * @param {{ path: string }} data
 * @this {import('@types/hexo')}
 */
async function processHTMLCSS(str, data) {
  if (!str) { return str; }
  const path = data.path;
  try {
    const base = path ? parse(path).base : "temp.html";
    const result = await postcss([postcssPresetEnv({ stage: 0, browsers })]).process(str, { from: base, to: base, syntax: postcssHtml() });
    return result.content;
  }
  catch (err) {
    throw new Error(`Path: ${path}\n${err}`);
  }
}

module.exports = {
  processCSS,
  processHTMLCSS
}