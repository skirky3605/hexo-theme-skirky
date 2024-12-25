const fs = require("fs");
const { resolve } = require("./utils");

module.exports = hexo => {
  return {
    path: "js/third-party/pace.js",
    data: () => fs.createReadStream(resolve("pace-js", "pace.js"))
  };
}