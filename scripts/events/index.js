/* global hexo */
"use strict";

const { renderGeneratorAsync } = require("./lib/utils");

hexo.extend.filter.register("before_generate", () => require("./lib/highlight")(hexo), 0);
hexo.extend.filter.register("after_generate", () => require("./lib/service-worker")(hexo), Number.MAX_VALUE);
hexo.extend.generator.register("analytics_generator", () => require("./lib/analytics")(hexo));
hexo.extend.generator.register("webmanifest_generator", () => require("./lib/webmanifest")(hexo));
hexo.extend.generator.register("pace_generator", () => renderGeneratorAsync(hexo, "third-party/pace.js", "pace-js", "pace.js"));
hexo.extend.generator.register("pjax_generator", () => renderGeneratorAsync(hexo, "third-party/pjax.js", "@next-theme/pjax", "pjax.js"));
hexo.extend.generator.register("search_generator", () => renderGeneratorAsync(hexo, "third-party/search.js", "hexo-generator-searchdb", "dist/search.js"));

hexo.on("ready", () => {
    if (!/^(g|s)/.test(hexo.env.cmd) || process.argv.includes('--disable-banner')) { return; }
    const { version } = require('../../package.json');
    hexo.log.info("==========================================");
    hexo.log.info("                                          ");
    hexo.log.info("  ████████████████      ████████████████  ");
    hexo.log.info("  ████████████████      ████████████████  ");
    hexo.log.info("  ██        ██████      ████████████████  ");
    hexo.log.info("    ████    ██████                        ");
    hexo.log.info("  ██  ██    ██  ██  ×  ██████████████████ ");
    hexo.log.info("      ██    ██            ████    ████    ");
    hexo.log.info("                                          ");
    hexo.log.info("                                          ");
    hexo.log.info(" └─              ─┘    └─              ─┘ ");
    hexo.log.info("==========================================");
    hexo.log.info("薇ㄦ猫猫送给小诗同志的礼物");
    hexo.log.info("Hello from 2025");
    hexo.log.info(`Version ${version}`);
    hexo.log.info("==========================================");
});