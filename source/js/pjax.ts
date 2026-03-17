/// <reference path="boot.ts" />

if ("replaceState" in history) {
  const pjax = new Pjax({
    selectors: [
      "head title",
      'meta[property="og:title"]',
      'script[type="application/json"]',
      ".cover",
      ".main-inner",
      ".post-toc-wrap",
      ".pjax"
    ],
    analytics: false,
    cacheBust: false
  });

  Pjax.prototype.executeScripts =
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
        if (code !== '') {
          script.appendChild(document.createTextNode(code));
        }
        element.parentNode!.replaceChild(script, element);
      }
    };

  document.addEventListener("pjax:success", () => {
    const elements = document.querySelectorAll<HTMLScriptElement>("script[data-pjax]");
    pjax.executeScripts(elements);
    Skirky.boot.refresh();
    const hasList = !!document.body.classList;
    if (hasList) {
      document.body.classList.remove("sidebar-active");
    }
    else {
      document.body.className = document.body.className.replace(/(^|\s)sidebar-active(\s|$)/g, '');
    }
    const hasTOC = document.querySelector(".post-toc:not(.placeholder-toc)");
    const inner = document.querySelector(".sidebar-inner")!;
    if (hasTOC) {
      if (hasList) {
        inner.classList.add("sidebar-nav-active");
      }
      else {
        if (!/(^|\s)sidebar-nav-active(\s|$)/.test(inner.className)) {
          inner.className += " sidebar-nav-active";
        }
      }
    }
    else {
      if (hasList) {
        inner.classList.remove("sidebar-nav-active");
      }
      else {
        inner.className = inner.className.replace(/(^|\s)sidebar-nav-active(\s|$)/g, '');
      }
    }
    Skirky.utils.activateSidebarPanel(hasTOC ? 0 : 1);
  });

  window.pjax = pjax;
}