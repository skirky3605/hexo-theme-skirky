const fs = require("fs");
const { resolve } = require("./utils");

module.exports = hexo => {
  return {
    path: `${hexo.theme.config.js}/third-party/search.js`,
    data: () => fs.createReadStream(resolve("hexo-generator-searchdb", "dist/search.js"))
  };
}