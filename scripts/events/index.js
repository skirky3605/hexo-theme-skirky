/* global hexo */
"use strict";

const { renderGeneratorAsync } = require("./lib/utils");

hexo.extend.filter.register("before_generate", () => require("./lib/highlight")(hexo), 0);
hexo.extend.filter.register("after_generate", () => require("./lib/service-worker")(hexo), Number.MAX_VALUE);
hexo.extend.generator.register("webmanifest_generator", () => require("./lib/webmanifest")(hexo));
hexo.extend.generator.register("pace_generator", () => renderGeneratorAsync(hexo, "third-party/pace.js", "pace-js", "pace.js"));
hexo.extend.generator.register("pjax_generator", () => renderGeneratorAsync(hexo, "third-party/pjax.js", "@next-theme/pjax", "pjax.js"));
hexo.extend.generator.register("search_generator", () => renderGeneratorAsync(hexo, "third-party/search.js", "hexo-generator-searchdb", "dist/search.js"));