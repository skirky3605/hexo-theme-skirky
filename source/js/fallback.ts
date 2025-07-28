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
  if ((document as IEDocument).documentMode < 7) {
    addStyle("body .background{position:absolute}a.random-link{color:#000;background:none}.menu-item a .badge{right:auto}.sidebar-container{position:absolute}");
  }
}

if (window.CSS ? !window.CSS?.supports("width", "calc(40px - 20px)") :
  !(() => {
    try {
      const div = document.createElement("div");
      div.style.width = "calc(40px - 20px)";
      document.body.appendChild(div);
      let isCalcAvailable = div.offsetWidth === 20;
      if (!isCalcAvailable) {
        div.style.width = "-webkit-calc(40px - 20px)";
        isCalcAvailable = div.offsetWidth === 20;
        if (!isCalcAvailable) {
          div.style.width = "-moz-calc(40px - 20px)";
          isCalcAvailable = div.offsetWidth === 20;
        }
      }
      document.body.removeChild(div);
      return isCalcAvailable;
    }
    catch {
      return false;
    }
  })()) {
  addStyle(".sidebar-container{display:none}");
}
else if (!("flex" in document.documentElement.style || "msFlex" in document.documentElement.style)) {
  addStyle("@media(min-width:768px){.main-grid .main-inner{float:left;width:-webkit-calc(100% - 290px);width:-moz-calc(100% - 290px);width:calc(100% - 290px)}}");
}

if (!window.MediaList) {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/respond.js/dest/respond.min.js";
  const parentNode = document.head || document.scripts[0].parentNode;
  parentNode.appendChild(script);
}