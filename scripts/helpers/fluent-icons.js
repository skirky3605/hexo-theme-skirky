"use strict";

const fs = require("fs");
const path = require("path");
const fluentui = path.dirname(require.resolve(`@fluentui/svg-icons/package.json`));

/**
 * @typedef {{filled: IconSize, regular: IconSize, light: IconSize, color: IconSize}} IconVariant
 * @typedef {{size10: Object<string, string>, size12: Object<string, string>, size16: Object<string, string>, size20: Object<string, string>, size24: Object<string, string>, size28: Object<string, string>, size32: Object<string, string>, size40: Object<string, string>, size48: Object<string, string>}} IconSize
 */

/** @type {IconVariant} */
const variants = { filled: undefined, regular: undefined, light: undefined, color: undefined };
/** @type {IconSize} */
const sizes = { size10: undefined, size12: undefined, size16: undefined, size20: undefined, size24: undefined, size28: undefined, size32: undefined, size40: undefined, size48: undefined };

const icons = new Proxy(variants, {
  get: function (_, variant) {
    return new Proxy(sizes, {
      get: function (_, size) {
        return new Proxy({}, {
          get: function (_, name) {
            const buffer = fs.readFileSync(`${fluentui}/icons/${name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')}_${size.replace(/size/i, '')}_${variant.toLowerCase()}.svg`);
            return buffer.toString();
          }
        });
      }
    });
  }
});

module.exports = {
  icons,
  fluentIcon: function(name, size = "size20", variant = "regular") {
    return icons[variant][size][name];
  }
}