(() => {
  if (!window.globalThis) {
    (window as any).globalThis = window;
  }

  if (!String.prototype.startsWith) {
    String.prototype.startsWith =
      function (searchString, position = 0) {
        return this.indexOf(searchString, position) === position;
      };
  }

  if (!String.prototype.endsWith) {
    String.prototype.endsWith =
      function (searchString, position = this.length) {
        const index = this.lastIndexOf(searchString);
        return index !== -1 && index === position - searchString.length;
      };
  }

  if (typeof DOMTokenList !== "undefined") {
    if (!DOMTokenList.prototype.replace) {
      DOMTokenList.prototype.replace =
        function (token, newToken) {
          if (this.contains(token)) {
            this.remove(token);
            this.add(newToken);
            return true;
          }
          return false;
        };
    }
  }

  if (typeof HTMLElement !== "undefined") {
    (HTMLElement.prototype as any).wrap =
      function (wrapper: HTMLElement) {
        this.parentNode.insertBefore(wrapper, this);
        this.parentNode.removeChild(this);
        wrapper.appendChild(this);
      };
  }

  if (typeof Document !== "undefined" && !document.currentScript) {
    Object.defineProperty(Document.prototype, "currentScript", {
      get() {
        const scripts = this.getElementsByTagName("script");
        return scripts[scripts.length - 1];
      }
    });
  }

  if (!document.documentElement.scrollTo) {
    const scrollTo = window.scrollTo;
    window.scrollTo = function () {
      const options: ScrollToOptions = arguments[0];
      if (typeof arguments[0] === "object") {
        scrollTo(options.left || 0, options.top || 0);
      }
      else {
        scrollTo.apply(window, arguments);
      }
    };
  }
})();