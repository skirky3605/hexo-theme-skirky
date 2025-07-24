/// <reference path="search.ts" />

interface IEDocument extends Document {
  documentMode: number;
}

interface IEHTMLStyleElement extends HTMLStyleElement {
  styleSheet: {
    cssText: string;
  };
}

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

if (typeof (document as IEDocument).documentMode === "number") {
  const documentMode = (document as IEDocument).documentMode;
  if (documentMode < 7) {
    addStyle("body .background{position:absolute}a.random-link{color:#000;background:none}.menu-item a .badge{right:auto}.sidebar-container{position:absolute}");
  }
  else if (documentMode == 9) {
    addStyle("@media(min-width:768px){.main-grid .main-inner{float:left;width:calc(100% - 290px)}}");
  }
  else {
    addStyle(".sidebar-container{display:none}");
  }
}
else {
  if (!window.CSS?.supports("display", "flex") && !("flex" in document.documentElement.style || "msFlex" in document.documentElement.style)) {
    addStyle(".sidebar-container{display:none}");
  }
}

if (!window.MediaList) {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/respond.js/dest/respond.min.js";
  const parentNode = document.head || document.scripts[0].parentNode;
  parentNode.appendChild(script);
}