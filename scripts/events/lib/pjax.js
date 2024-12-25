const fs = require("fs");
const { resolve } = require("./utils");

module.exports = hexo => {
  return {
    path: "js/third-party/pjax.js",
    data: () => fs.createReadStream(resolve("@next-theme/pjax", "pjax.js"))
  };
}