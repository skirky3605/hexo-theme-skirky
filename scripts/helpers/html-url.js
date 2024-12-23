/** Based on [`scripts/helpers/next-url.js` from hexo-theme-next](https://github.com/next-theme/hexo-theme-next/blob/master/scripts/helpers/next-url.js) **/
"use strict";

const { htmlTag } = require("hexo-util");
const { parse } = require("url");

module.exports = function (path, text, options = {}, decode = false) {
  const { config } = this;
  const data = parse(path);
  /** @type {string} */
  const siteHost = parse(config.url).hostname || config.url;

  let exturl = '';
  let tag = 'a';
  let attrs = { href: this.url_for(path) };

  for (const key in options) {
    /**
     * If option have `class` attribute, add it to
     * 'exturl' class if `exturl` option enabled.
     */
    if (exturl !== '' && key === "class") {
      attrs[key] += ' ' + options[key];
    } else {
      attrs[key] = options[key];
    }
  }

  // If it's external link, rewrite attributes.
  if (data.protocol && data.hostname !== siteHost) {
    attrs.external = null;
    // Only for simple link need to rewrite/add attributes.
    attrs.rel = attrs.rel || "noopener";
    attrs.target = "_blank";
  }

  return htmlTag(tag, attrs, decode ? decodeURI(text) : text, false);
};
