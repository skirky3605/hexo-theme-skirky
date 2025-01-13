declare const Skirky: {
  boot: {
    refresh(): void;
  };
  utils: {
    activateSidebarPanel(index: 0 | 1): void;
  };
}

declare class Pjax {
  constructor(options?: Partial<Pjax.IOptions>);
  executeScripts(elements: NodeListOf<HTMLScriptElement>): void;
}

declare namespace Pjax {
  export interface IOptions {
    /**
     * CSS selectors for the elements to replace.
     */
    selectors: string[];

    /**
     * Function that allows you to add behavior for analytics.
     * By default it tries to track a pageview with Google Analytics (if it exists on the page).
     * It's called every time a page is switched, even for history navigation.
     * Set to false to disable this behavior.
     */
    analytics: Function | false;

    /**
     * When set to true, append a timestamp query string segment to the requested URLs in order to skip browser cache.
     */
    cacheBust: boolean;
  }
}

if (history.replaceState!) {
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
        if (typeof script.dataset?.pjax !== "undefined") {
          script.dataset.pjax = '';
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
    const hasTOC = document.querySelector(".post-toc:not(.placeholder-toc)");
    const inner = document.querySelector(".sidebar-inner")!;
    if (hasTOC) {
      if (inner.classList) {
        if (!inner.classList.contains("sidebar-nav-active")) {
          inner.classList.add("sidebar-nav-active");
        }
      }
      else {
        if (!/(^|\s)sidebar-nav-active(\s|$)/.test(inner.className)) {
          inner.className += " sidebar-nav-active";
        }
      }
    }
    else {
      if (inner.classList) {
        inner.classList.remove("sidebar-nav-active");
      }
      else {
        inner.className = inner.className.replace(/(^|\s)sidebar-nav-active(\s|$)/g, '');
      }
    }
    Skirky.utils.activateSidebarPanel(hasTOC ? 0 : 1);
  });

  (window as any).pjax = pjax;
}