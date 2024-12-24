/* global hexo */
"use strict";

const htmlUrl = require("./html-url");
hexo.extend.helper.register("html_url", htmlUrl);