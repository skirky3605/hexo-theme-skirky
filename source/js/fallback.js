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

if (!window.CSS || (!CSS?.supports("position", "sticky") && !CSS?.supports("position", "-webkit-sticky"))) {
  addStyle(".sidebar-container{position:fixed}");
}

if (typeof document.documentMode === "number") {
  if (document.documentMode < 10) {
    addStyle(".main-grid .main-inner{width:calc(100% - 280px)}");
  }
  if (document.documentMode < 7) {
    addStyle("body .background{position:absolute}a.random-link{color:#000;background:transparent}.menu-item a .badge{right:auto}.sidebar-container{position:absolute}");
  }
  if (document.documentMode < 9) {
    addStyle(".sidebar-container{display:none}");
  }
}
