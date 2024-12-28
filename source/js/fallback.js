if (typeof document.documentMode === "number" && document.documentMode < 7) {
  /**
   * @param {string} css
   */
  function addStyle(css) {
    const style = document.createElement("style");
    const parentNode = document.head || document.scripts[document.scripts.length - 1].parentNode;
    parentNode.appendChild(style);
    if (style.styleSheet) {
      style.type = "text/css";
      style.styleSheet.cssText = css;
    }
    else {
      style.innerText = css;
    }
  }
  addStyle("body .background{position:absolute}a.random-link{color:#000;background:transparent}.menu-item a .badge{right:auto}");
}