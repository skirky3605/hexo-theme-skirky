if (typeof window.history.replaceState !== "undefined") {
  const pjax = new Pjax({
    selectors: [
      'head title',
      'meta[property="og:title"]',
      '.cover',
      '.main-inner',
      '.pjax'
    ],
    analytics: false,
    cacheBust: false
  });

  document.addEventListener('pjax:success', () => {
    let elements = document.querySelectorAll('script[data-pjax]');
    if (typeof elements.forEach === "undefined") {
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