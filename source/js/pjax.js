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

  Pjax.prototype.executeScripts =
    /** @param {NodeListOf<HTMLScriptElement>} elements */
    function (elements) {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const code = element.text || element.textContent || element.innerHTML || '';
        const script = document.createElement("script");
        const attributes = element.attributes;
        for (let j = 0; j < attributes.length; j++) {
          const attribute = attributes[j];
          script.setAttribute(attribute.name, attribute.value);
        }
        if (script.src) {
          // Force synchronous loading of peripheral JS.
          script.async = false;
        }
        if (typeof script.dataset?.pjax !== "undefined") {
          script.dataset.pjax = '';
        }
        if (code !== '') {
          script.appendChild(document.createTextNode(code));
        }
        element.parentNode.replaceChild(script, element);
      }
    };

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