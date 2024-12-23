/* global hexo */

"use strict";

hexo.extend.filter.register("before_generate", () => {
  // Highlight
  require("./lib/highlight")(hexo);
}, 0);
