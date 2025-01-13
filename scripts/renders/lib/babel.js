const { transformAsync } = require("@babel/core");
const { parse } = require("path")

module.exports =
  /**
   * @param {import("@types/hexo").extend.RendererData} data
   * @this {import("@types/hexo")}
   */
  async function (data) {
    const hexo = this;
    const { path, text } = data;
    if (!text) { return text; }
    const { base } = parse(path);
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