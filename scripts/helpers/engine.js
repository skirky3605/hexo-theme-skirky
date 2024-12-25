/* global hexo */
"use strict";

hexo.extend.helper.register("html_url", require("./html-url"));

hexo.extend.helper.register('post_count', function (year) {
  return this.site.posts.filter(post => this.date(post.date, 'YYYY') === year).count();
});