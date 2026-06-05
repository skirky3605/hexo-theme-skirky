/* global hexo */
'use strict';

module.exports = {
  /** @this {import("hexo")} */
  htmlConfig: function () {
    const { config, theme, url_for } = this;
    const exportConfig = {
      hostname: new URL(config.url).hostname || config.url,
      root: config.root,
      hljswrap: config.highlight.wrap,
      path: url_for(config.search.path),
      localsearch: theme.local_search,
      serverworker: theme.service_worker.enable
    };
    return exportConfig;
  },
  htmlConfigUnique: function () {
    const { page, is_home, is_post } = this;
    return {
      isHome: is_home(),
      isPost: is_post(),
      lang: page.lang,
      permalink: page.permalink || ''
    };
  }
}