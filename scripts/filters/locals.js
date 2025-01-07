/* global hexo */
"use strict";

const fs = require("fs");
const path = require("path");
const creativecommons = path.dirname(require.resolve(`@creativecommons/vocabulary/package.json`));

const keys = ["toc", "reward_settings", "quicklink"];

hexo.extend.filter.register("template_locals", locals => {
  const { theme, page } = locals;
  page.lang = page.lang || page.language;
  // Creative Commons
  locals.ccURL = "https://creativecommons.org/" + (theme.creative_commons.license === "cc-zero" ? "publicdomain/zero/1.0/" : "licenses/" + theme.creative_commons.license + "/4.0/") + (theme.creative_commons.language || '');
  locals.ccBadge = fs.readFileSync(`${creativecommons}/assets/license_badges/${theme.creative_commons.size}/${theme.creative_commons.license.replace(/-/g, '_')}.svg`).toString();
  // Front-matter
  keys.forEach(key => {
    page[key] = { ...theme[key], ...page[key] };
  });
});
