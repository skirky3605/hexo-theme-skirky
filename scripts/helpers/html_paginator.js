/* global hexo */
"use strict";

hexo.extend.helper.register("html_paginator", function() {
  const prev = "上一页";
  const next = "下一页";
  let paginator = this.paginator({
    prev_text: "上一页",
    next_text: "下一页",
    mid_size : 1,
    escape   : false
  });
  paginator = paginator
    .replace('rel="prev"', `rel="prev" title="${prev}" aria-label="${prev}"`)
    .replace('rel="next"', `rel="next" title="${next}" aria-label="${next}"`);
  return paginator;
});
