if (typeof globalThis === "undefined") {
  window.globalThis = window;
}

if (typeof String.prototype.startsWith === "undefined") {
  String.prototype.startsWith =
    /**
     * @param {string} searchString
     * @param {number} position
     */
    function (searchString, position = 0) {
      return this.indexOf(searchString, position) === position;
    };
}

if (typeof DOMTokenList !== "undefined") {
  if (typeof DOMTokenList.prototype.replace === "undefined") {
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