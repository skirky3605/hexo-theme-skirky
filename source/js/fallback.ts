/// <reference path="search.ts" />

interface IEDocument extends Document {
  documentMode: number;
}

interface IEHTMLStyleElement extends HTMLStyleElement {
  styleSheet: {
    cssText: string;
  };
}

if (typeof (document as IEDocument).documentMode === "number") {
  function addStyle(css: string) {
    const style = document.createElement("style") as IEHTMLStyleElement;
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
  if ((document as IEDocument).documentMode < 10) {
    addStyle(".main-grid .main-inner{width:calc(100% - 290px)}");
  }
  if ((document as IEDocument).documentMode < 7) {
    addStyle("body .background{position:absolute}a.random-link{color:#000;background:transparent}.menu-item a .badge{right:auto}.sidebar-container{position:absolute}");
  }
  if ((document as IEDocument).documentMode < 9) {
    addStyle(".sidebar-container{display:none}");
  }
}
