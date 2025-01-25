hexo.extend.renderer.register("js", "js", (data) => require("./lib/babel")(hexo, data, "js"));
hexo.extend.renderer.register("ts", "js", (data) => require("./lib/babel")(hexo, data, "ts"));