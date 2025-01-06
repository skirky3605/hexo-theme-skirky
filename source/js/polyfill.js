if (!window.globalThis) {
  window.globalThis = window;
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith =
    /**
     * @param {string} searchString
     * @param {number} position
     */
    function (searchString, position = 0) {
      return this.indexOf(searchString, position) === position;
    };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith =
    /**
     * @param {string} searchString
     * @param {number} position
     */
    function (searchString, position = this.length) {
      const index = this.lastIndexOf(searchString);
      return index !== -1 && index === position - searchString.length;
    };
}

if (typeof DOMTokenList !== "undefined") {
  if (!DOMTokenList.prototype.replace) {
    DOMTokenList.prototype.replace =
      /**
       * @param {string} token
       * @param {string} newToken
       */
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
  HTMLElement.prototype.wrap =
    /**
     * @param {HTMLElement} wrapper
     */
    function (wrapper) {
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