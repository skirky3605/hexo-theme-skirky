const { transformAsync } = require("@babel/core");
const { parse } = require("path")

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
      return results.code;
    }
    catch (e) {
      throw new Error(`Path: ${path}\n${e}`);
    }
  }