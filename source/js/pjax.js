if (window.history.replaceState) {
  const pjax = new Pjax({
    selectors: [
      'head title',
      'meta[property="og:title"]',
      'script[type="application/json"]',
      '.cover',
      '.main-inner',
      '.pjax'
    ],
    analytics: false,
    cacheBust: false
  });

  document.addEventListener('pjax:success', () => {
    let elements = document.querySelectorAll('script[data-pjax]');
    if (!elements.forEach) {
      const array = [];
      for (let i = 0; i < elements.length; i++) {
        array.push(elements[i]);
      }
      elements = array;
    }
    pjax.executeScripts(elements);
    Skirky.boot.refresh();
  });

  window.pjax = pjax;
}