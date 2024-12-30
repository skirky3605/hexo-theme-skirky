/* global hexo */
'use strict';

const keys = ['toc', 'reward_settings', 'quicklink'];

hexo.extend.filter.register('template_locals', locals => {
  const { theme, page } = locals;
  page.lang = page.lang || page.language;
  // Creative Commons
  locals.ccURL = 'https://creativecommons.org/' + (theme.creative_commons.license === 'cc-zero' ? 'publicdomain/zero/1.0/' : 'licenses/' + theme.creative_commons.license + '/4.0/') + (theme.creative_commons.language || '');
});
