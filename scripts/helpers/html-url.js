/** Based on [`scripts/helpers/next-url.js` from hexo-theme-next](https://github.com/next-theme/hexo-theme-next/blob/master/scripts/helpers/next-url.js) **/
"use strict";

const { htmlTag } = require("hexo-util");

module.exports =
  /**
   * @param {string} path
   * @param {string} text
   * @param {Object<string, string>} [options = {}]
   */
  function (path, text, options = {}, decode = false) {
    const { config } = this;

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

    try {
      const data = new URL(path);
      /** @type {string} */
      const siteHost = new URL(config.url).hostname || config.url;
      // If it's external link, rewrite attributes.
      if (data.protocol && data.hostname !== siteHost) {
        attrs.external = null;
        // Only for simple link need to rewrite/add attributes.
        attrs.rel = attrs.rel || "noopener noreferrer";
        attrs.target = "_blank";
      }
    }
    catch { }

    return htmlTag(tag, attrs, decode ? decodeURI(text) : text, false);
  };
