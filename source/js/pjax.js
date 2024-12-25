const pjax = new Pjax({
  selectors: [
    'head title',
    'meta[property="og:title"]',
    '.cover',
    '.main',
    '.pjax'
  ],
  analytics: false,
  cacheBust: false
});

document.addEventListener('pjax:success', () => {
  pjax.executeScripts(document.querySelectorAll('script[data-pjax]'));
  Skirky.boot.refresh();
});

window.pjax = pjax;