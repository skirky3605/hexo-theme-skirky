/* global hexo */
"use strict";

const fs = require("fs");

const keys = ["toc", "reward_settings", "quicklink"];

hexo.extend.filter.register("template_locals", locals => {
  const { theme, page } = locals;
  page.lang = page.lang || page.language;
  // Creative Commons
  locals.ccURL = "https://creativecommons.org/" + (theme.creative_commons.license === "cc-zero" ? "publicdomain/zero/1.0/" : "licenses/" + theme.creative_commons.license + "/4.0/") + (theme.creative_commons.language || '');
  locals.ccBadge = fs.readFileSync(require.resolve(`@creativecommons/vocabulary/assets/license_badges/${theme.creative_commons.size}/${theme.creative_commons.license.replace(/-/g, '_')}.svg`), "utf-8");
  // Front-matter
  keys.forEach(key => {
    page[key] = { ...theme[key], ...page[key] };
  });
});
