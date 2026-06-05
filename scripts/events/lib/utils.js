"use strict";

/**
 * @param {import("hexo")} hexo
 * @param {string} path
 * @param {string} file
 */
function renderGeneratorAsync(hexo, path, file) {
  return {
    path: `${hexo.theme.config.js}/${path}`,
    data: () => hexo.render.render({ path: require.resolve(file) })
  };
}

module.exports = {
  renderGeneratorAsync
};
