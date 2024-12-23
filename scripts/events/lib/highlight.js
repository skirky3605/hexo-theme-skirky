"use strict";

const { highlightTheme } = require("./utils");

module.exports = hexo => {
  const theme = hexo.theme.config;
  hexo.config.highlight.hljs = false;
  theme.highlight = {
    light: highlightTheme(theme.codeblock.theme.light),
    dark: highlightTheme(theme.codeblock.theme.dark)
  };
};
