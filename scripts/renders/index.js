hexo.extend.renderer.register("js", "js", data => require("./lib/babel")(hexo, data, "js"));
hexo.extend.renderer.register("ts", "js", data => require("./lib/babel")(hexo, data, "ts"));
hexo.extend.filter.register("after_render:css", require("./lib/postcss.js").processCSS);
hexo.extend.filter.register("after_render:html", require("./lib/postcss.js").processHTMLCSS);