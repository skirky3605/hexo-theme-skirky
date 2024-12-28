/* global hexo */
"use strict";

hexo.extend.filter.register("before_generate", () => require("./lib/highlight")(hexo), 0);
hexo.extend.generator.register("pace_generator", () => require("./lib/pace")(hexo));
hexo.extend.generator.register("pjax_generator", () => require("./lib/pjax")(hexo));
hexo.extend.generator.register("search_generator", () => require("./lib/search")(hexo));
