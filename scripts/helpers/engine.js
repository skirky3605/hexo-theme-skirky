/* global hexo */
"use strict";

hexo.extend.helper.register("html_url", require("./html-url"));
hexo.extend.helper.register("html_paginator", require("./html-paginator"));
hexo.extend.helper.register("post_count", function (/** @type {number} */ year) {
  return this.site.posts.filter(post => this.date(post.date, "YYYY") === year).count();
});
hexo.extend.helper.register("fluent_icon", require("./fluent-icons").fluentIcon);
hexo.extend.helper.register("html_config", require("./html-config").htmlConfig);
hexo.extend.helper.register("html_config_unique", require("./html-config").htmlConfigUnique);
hexo.extend.helper.register("html_data", function (/** @type {string} */ name, ...data) {
  const json = data.length === 1 ? data[0] : Object.assign({}, ...data);
  return `<script class="html-config" data-name="${name}" type="application/json">${JSON.stringify(json).replace(/</g, '\\u003c')}</script>`;
});