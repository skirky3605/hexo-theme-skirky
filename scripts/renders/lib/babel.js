const { transformAsync } = require("@babel/core");
const { parse } = require("path");
const { minify } = require("terser");

/**
 * @param {import("@types/hexo")} hexo
 * @param {string} str
 */
async function terser(hexo, str) {
  const options = hexo.theme.config.terser.js;
  if (!str) { return str; }
  return minify(str, options).then(x => x.code);
}

module.exports =
  /**
   * @param {import("@types/hexo")} hexo
   * @param {import("@types/hexo").extend.RendererData} data
   * @param {"js" | "ts"} type
   */
  async function (hexo, data, type) {
    const { path, text } = data;
    if (!text) { return text; }
    const base = path ? parse(path).base : `temp.${type}`;
    /** @type {import("@types/babel__core").TransformOptions} */
    const options = {
      filename: base,
      presets: [
        ["@babel/preset-typescript"]
      ],
      sourceType: "unambiguous",
      ...hexo.theme.config.babel.options
    };
    try {
      const results = await transformAsync(text, options);
      return await terser(hexo, results.code);
    }
    catch (e) {
      throw new Error(`Path: ${path}\n${e}`);
    }
  }